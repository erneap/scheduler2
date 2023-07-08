package controllers

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/erneap/go-models/employees"
	"github.com/erneap/go-models/logs"
	"github.com/erneap/go-models/sites"
	"github.com/erneap/go-models/svcs"
	"github.com/erneap/scheduler2/schedulerApi/models/web"
	"github.com/erneap/scheduler2/schedulerApi/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetSite(c *gin.Context) {
	teamID := c.Param("teamid")
	siteID := c.Param("siteid")

	site, err := getSite(teamID, siteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"GetSite: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"GetSite: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, "GetSite: Provided site with employees")
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func ShowEmployees(c *gin.Context) bool {
	return strings.ToLower(c.Param("employees")) == "true"
}

func getSite(teamid, siteid string) (*sites.Site, error) {
	site, err := services.GetSite(teamid, siteid)
	if err != nil {
		return nil, err
	}

	emps, err := services.GetEmployees(teamid, siteid)
	if err != nil {
		return nil, err
	}
	site.Employees = append(site.Employees, emps...)
	sort.Sort(employees.ByEmployees(site.Employees))

	return site, nil
}

func CreateSite(c *gin.Context) {
	var data web.NewSiteRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSite: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.CreateSite(data.TeamID, data.SiteID, data.Name)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSite: CreateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}
	site.ShowMids = data.UseMids
	site.UtcOffset = data.Offset
	newWorkcenter := sites.Workcenter{
		ID:     "leads",
		Name:   "LEADS",
		SortID: uint(1),
	}
	site.Workcenters = append(site.Workcenters, newWorkcenter)
	err = services.UpdateSite(data.TeamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSite: UpdateSite: %s", err.Error()))
	}
	teamID, _ := primitive.ObjectIDFromHex(data.TeamID)

	emp := employees.Employee{
		ID:     primitive.NewObjectID(),
		TeamID: teamID,
		SiteID: site.ID,
		Email:  data.Leader.EmailAddress,
		Name: employees.EmployeeName{
			FirstName:  data.Leader.FirstName,
			MiddleName: data.Leader.MiddleName,
			LastName:   data.Leader.LastName,
		},
		Data: employees.EmployeeData{},
	}
	asgmt := employees.Assignment{
		ID:           uint(1),
		Site:         data.SiteID,
		Workcenter:   "leads",
		StartDate:    time.Now().UTC(),
		EndDate:      time.Date(9999, 12, 30, 0, 0, 0, 0, time.UTC),
		RotationDate: time.Date(1, 1, 1, 0, 0, 0, 0, time.UTC),
		RotationDays: 0,
	}
	asgmt.AddSchedule(7)
	for i := 1; i < 6; i++ {
		asgmt.Schedules[0].UpdateWorkday(uint(i), "leads", "D", 8)
	}
	emp.Data.Assignments = append(emp.Data.Assignments, asgmt)

	empl, err := services.CreateEmployee(emp, data.Leader.Password,
		"scheduler-siteleader", data.TeamID, data.SiteID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSite: CreateEmployee (Lead): %s", err.Error()))
	}
	empl, err = services.GetEmployee(empl.ID.Hex())
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSite: GetEmployee (siteleader): %s", err.Error()))
	}
	site.Employees = append(site.Employees, *empl)

	if data.Scheduler != nil {
		emp = employees.Employee{
			ID:     primitive.NewObjectID(),
			TeamID: teamID,
			SiteID: site.ID,
			Email:  data.Scheduler.EmailAddress,
			Name: employees.EmployeeName{
				FirstName:  data.Scheduler.FirstName,
				MiddleName: data.Scheduler.MiddleName,
				LastName:   data.Scheduler.LastName,
			},
			Data: employees.EmployeeData{},
		}
		asgmt := employees.Assignment{
			ID:           uint(1),
			Site:         data.SiteID,
			Workcenter:   "leads",
			StartDate:    time.Now().UTC(),
			EndDate:      time.Date(9999, 12, 30, 0, 0, 0, 0, time.UTC),
			RotationDate: time.Date(1, 1, 1, 0, 0, 0, 0, time.UTC),
			RotationDays: 0,
		}
		asgmt.AddSchedule(7)
		for i := 1; i < 6; i++ {
			asgmt.Schedules[0].UpdateWorkday(uint(i), "leads", "D", 8)
		}
		emp.Data.Assignments = append(emp.Data.Assignments, asgmt)

		empl, err = services.CreateEmployee(emp, data.Scheduler.Password,
			"scheduler-scheduler", data.TeamID, data.SiteID)
		if err != nil {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSite: CreateEmployee (scheduler): %s", err.Error()))
		}
		empl, err = services.GetEmployee(empl.ID.Hex())
		if err != nil {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSite: GetEmployee (scheduler): %s", err.Error()))
		}
		site.Employees = append(site.Employees, *empl)
	}
	sort.Sort(employees.ByEmployees(site.Employees))

	svcs.AddLogEntry("scheduler", logs.Debug, "CreateSite: Site Created")
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func UpdateSite(c *gin.Context) {
	var data web.NewSiteRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSite: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := getSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSite: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSite: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	site.Name = data.Name
	site.UtcOffset = data.Offset
	site.ShowMids = data.UseMids

	err = services.UpdateSite(data.TeamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSite: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, "UpdateSite: Site Updated: "+
		site.Name)
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func DeleteSite(c *gin.Context) {
	teamid := c.Param("teamid")
	siteid := c.Param("siteid")

	err := services.DeleteSite(teamid, siteid)

	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteSite: DeleteSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}
	c.Status(http.StatusOK)
}

// mass create for site's employee leave balances
func AddSitesEmployeeLeaveBalances(c *gin.Context) {
	var data web.CreateEmployeeLeaveBalances
	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"AddSitesEmployeeLeaveBalances: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	start := time.Date(data.Year, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(data.Year, 12, 31, 0, 0, 0, 0, time.UTC)
	emps, _ := services.GetEmployees(data.TeamID, data.SiteID)
	for _, emp := range emps {
		if emp.IsActive(start) || emp.IsActive(end) {
			emp.CreateLeaveBalance(data.Year)
			services.UpdateEmployee(&emp)
		}
	}

	site, err := getSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"AddSitesEmployeeLeaveBalances: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSite: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, "AddSitesEmployeeLeaveBalances: "+
		"Site With Employee Provided after update")
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

// workcenter controls
func CreateWorkcenter(c *gin.Context) {
	var data web.NewSiteWorkcenter

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateWorkcenter: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := getSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateWorkcenter: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateWorkcenter: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}
	found := false
	sort := -1
	for i, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, data.WkctrID) {
			found = true
			wkctr.Name = data.Name
			site.Workcenters[i] = wkctr
		}
		if sort < int(wkctr.SortID) {
			sort = int(wkctr.SortID)
		}
	}
	if !found {
		wkctr := sites.Workcenter{
			ID:     data.WkctrID,
			Name:   data.Name,
			SortID: uint(sort + 1),
		}
		site.Workcenters = append(site.Workcenters, wkctr)
	}
	err = services.UpdateSite(data.TeamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateWorkcenter: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug,
		"CreateWorkcenter: Site Workcenter created")
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func UpdateWorkcenter(c *gin.Context) {
	var data web.SiteWorkcenterUpdate

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateWorkcenter: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := getSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateWorkcenter: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateWorkcenter: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	sort.Sort(sites.ByWorkcenter(site.Workcenters))

	for i, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, data.WkctrID) {
			switch strings.ToLower(data.Field) {
			case "id":
				wkctr.ID = data.Value
			case "name":
				wkctr.Name = data.Value
			case "move":
				if strings.EqualFold(data.Value, "up") {
					if i > 0 {
						tSort := site.Workcenters[i-1].SortID
						site.Workcenters[i-1].SortID = wkctr.SortID
						wkctr.SortID = tSort
					}
				} else if strings.EqualFold(data.Value, "down") {
					if i < len(site.Workcenters)-1 {
						tSort := site.Workcenters[i+1].SortID
						site.Workcenters[i+1].SortID = wkctr.SortID
						wkctr.SortID = tSort
					}
				}
			}
			site.Workcenters[i] = wkctr
		}
	}
	err = services.UpdateSite(data.TeamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateWorkcenter: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}
	svcs.AddLogEntry("scheduler", logs.Debug, "UpdateWorkcenter: Update Complete")
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func DeleteSiteWorkcenter(c *gin.Context) {
	teamID := c.Param("teamid")
	siteID := c.Param("siteid")
	wkctrID := c.Param("wkctrid")

	site, err := getSite(teamID, siteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteSiteWorkcenter: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteSiteWorkcenter: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	pos := -1
	for i, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, wkctrID) {
			pos = i
		}
	}
	if pos >= 0 {
		site.Workcenters = append(site.Workcenters[:pos], site.Workcenters[pos+1:]...)
	}
	sort.Sort(sites.ByWorkcenter(site.Workcenters))

	for i, wkctr := range site.Workcenters {
		wkctr.SortID = uint(i)
		site.Workcenters[i] = wkctr
	}
	err = services.UpdateSite(teamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteSiteWorkcenter: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}
	svcs.AddLogEntry("scheduler", logs.Debug, "DeleteSiteWorkcenter: "+
		"Workcenter deleted")
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func CreateWorkcenterPosition(c *gin.Context) {
	var data web.NewWorkcenterPosition

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateWorkcenterPosition: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateWorkcenterPosition: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateWorkcenterPosition: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, data.WkctrID) {
			found := false
			sort := -1
			for p, position := range wkctr.Positions {
				if strings.EqualFold(position.ID, data.PositionID) {
					found = true
					position.Name = data.Name
					wkctr.Positions[p] = position
					site.Workcenters[i] = wkctr
				}
				if !found && sort < int(position.SortID) {
					sort = int(position.SortID)
				}
			}
			if !found {
				position := sites.Position{
					ID:     data.PositionID,
					Name:   data.Name,
					SortID: uint(sort + 1),
				}
				wkctr.Positions = append(wkctr.Positions, position)
				site.Workcenters[i] = wkctr
			}
		}
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateWorkcenterPosition: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug,
		"CreateWorkcenterPosition: Workcenter Position Created!")
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func UpdateWorkcenterPosition(c *gin.Context) {
	var data web.WorkcenterPositionUpdate

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateWorkcenterPositon: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateWorkcenterPosition: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateWorkcenterPosition: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for w, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, data.WkctrID) {
			sort.Sort(sites.ByPosition(wkctr.Positions))
			for p, position := range wkctr.Positions {
				if strings.EqualFold(position.ID, data.PositionID) {
					switch strings.ToLower(data.Field) {
					case "name":
						position.Name = data.Value
					case "move":
						if strings.EqualFold(data.Value, "up") {
							if p > 0 {
								tSort := wkctr.Positions[p-1].SortID
								wkctr.Positions[p-1].SortID = position.SortID
								position.SortID = tSort
							}
						} else if strings.EqualFold(data.Value, "down") {
							if p < len(wkctr.Positions)-1 {
								tSort := wkctr.Positions[p+1].SortID
								wkctr.Positions[p+1].SortID = position.SortID
								position.SortID = tSort
							}
						}
					case "addassigned":
						found := false
						for _, asgn := range position.Assigned {
							if strings.EqualFold(asgn, data.Value) {
								found = true
							}
						}
						if !found {
							position.Assigned = append(position.Assigned, data.Value)
						}
					case "removeassigned":
						pos := -1
						for a, asgn := range position.Assigned {
							if strings.EqualFold(asgn, data.Value) {
								pos = a
							}
						}
						if pos >= 0 {
							position.Assigned = append(position.Assigned[:pos],
								position.Assigned[pos+1:]...)
						}
					}
					wkctr.Positions[p] = position
					site.Workcenters[w] = wkctr
				}
			}
		}
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateWorkcenterPosition: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateWorkcenterPosition: Workcenter Position Updated: %s", data.Field))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func DeleteWorkcenterPosition(c *gin.Context) {
	teamID := c.Param("teamid")
	siteID := c.Param("siteid")
	wkctrID := c.Param("wkctrid")
	positionID := c.Param("posid")

	site, err := services.GetSite(teamID, siteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteWorkcenterPosition: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteWorkcenterPosition: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for w, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, wkctrID) {
			pos := -1
			for p, position := range wkctr.Positions {
				if strings.EqualFold(position.ID, positionID) {
					pos = p
				}
			}
			if pos >= 0 {
				wkctr.Positions = append(wkctr.Positions[:pos], wkctr.Positions[pos+1:]...)
			}
			site.Workcenters[w] = wkctr
		}
	}

	if err = services.UpdateSite(teamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteWorkcenterPosition: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteWorkcenterPosition: Workcenter Position Deleted: %s-%s", wkctrID, positionID))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func CreateWorkcenterShift(c *gin.Context) {
	var data web.NewWorkcenterPosition

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateWorkcenterShift: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateWorkcenterShift: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateWorkcenterShift: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, data.WkctrID) {
			found := false
			sort := -1
			for s, shift := range wkctr.Shifts {
				if strings.EqualFold(shift.ID, data.PositionID) {
					found = true
					shift.Name = data.Name
					wkctr.Shifts[s] = shift
					site.Workcenters[i] = wkctr
				}
				if !found && sort < int(shift.SortID) {
					sort = int(shift.SortID)
				}
			}
			if !found {
				position := sites.Shift{
					ID:     data.PositionID,
					Name:   data.Name,
					SortID: uint(sort + 1),
				}
				wkctr.Shifts = append(wkctr.Shifts, position)
				site.Workcenters[i] = wkctr
			}
		}
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateWorkcenterShift: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateWorkcenterShift: Workcenter Shift Created: %s-%s", data.WkctrID,
		data.PositionID))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func UpdateWorkcenterShift(c *gin.Context) {
	var data web.WorkcenterPositionUpdate

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateWorkcenterShift: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateWorkcenterShift: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateWorkcenterShift: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for w, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, data.WkctrID) {
			sort.Sort(sites.ByShift(wkctr.Shifts))
			for s, shift := range wkctr.Shifts {
				if strings.EqualFold(shift.ID, data.PositionID) {
					switch strings.ToLower(data.Field) {
					case "name":
						shift.Name = data.Value
					case "paycode":
						code, _ := strconv.ParseUint(data.Value, 10, 32)
						shift.PayCode = uint(code)
					case "minimums":
						mins, _ := strconv.ParseUint(data.Value, 10, 32)
						shift.Minimums = uint(mins)
					case "move":
						if strings.EqualFold(data.Value, "up") {
							if s > 0 {
								tSort := wkctr.Shifts[s-1].SortID
								wkctr.Shifts[s-1].SortID = shift.SortID
								shift.SortID = tSort
							}
						} else if strings.EqualFold(data.Value, "down") {
							if s < len(wkctr.Shifts)-1 {
								tSort := wkctr.Shifts[s+1].SortID
								wkctr.Shifts[s+1].SortID = shift.SortID
								shift.SortID = tSort
							}
						}
					case "addcode":
						found := false
						for _, asgn := range shift.AssociatedCodes {
							if strings.EqualFold(asgn, data.Value) {
								found = true
							}
						}
						if !found {
							shift.AssociatedCodes = append(shift.AssociatedCodes, data.Value)
						}
					case "removecode":
						pos := -1
						for a, asgn := range shift.AssociatedCodes {
							if strings.EqualFold(asgn, data.Value) {
								pos = a
							}
						}
						if pos >= 0 {
							shift.AssociatedCodes = append(shift.AssociatedCodes[:pos],
								shift.AssociatedCodes[pos+1:]...)
						}
					}
					wkctr.Shifts[s] = shift
					site.Workcenters[w] = wkctr
				}
			}
		}
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateWorkcenterShift: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateWorkcenterShift: Workcenter Shift Updated: %s", data.Field))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func DeleteWorkcenterShift(c *gin.Context) {
	teamID := c.Param("teamid")
	siteID := c.Param("siteid")
	wkctrID := c.Param("wkctrid")
	shiftID := c.Param("shiftid")

	site, err := services.GetSite(teamID, siteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteWorkcenterShift: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteWorkcenterShift: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for w, wkctr := range site.Workcenters {
		if strings.EqualFold(wkctr.ID, wkctrID) {
			pos := -1
			for s, shift := range wkctr.Shifts {
				if strings.EqualFold(shift.ID, shiftID) {
					pos = s
				}
			}
			if pos >= 0 {
				wkctr.Shifts = append(wkctr.Shifts[:pos], wkctr.Shifts[pos+1:]...)
			}
			site.Workcenters[w] = wkctr
		}
	}

	if err = services.UpdateSite(teamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteWorkcenterShift: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteWorkcenterShift: Workcenter Shift Deleted: %s-%s", wkctrID, shiftID))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func CreateSiteLaborCode(c *gin.Context) {
	var data web.NewSiteLaborCode

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSiteLaborCode: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSiteLaborCode: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSiteLaborCode: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for r, rpt := range site.ForecastReports {
		if rpt.ID == data.ReportID {
			found := false
			for l, lCode := range rpt.LaborCodes {
				if strings.EqualFold(lCode.ChargeNumber, data.ChargeNumber) &&
					strings.EqualFold(lCode.Extension, data.Extension) {
					found = true
					if data.CLIN != "" {
						lCode.CLIN = data.CLIN
					}
					if data.SLIN != "" {
						lCode.SLIN = data.SLIN
					}
					if data.Location != "" {
						lCode.Location = data.Location
					}
					if data.WBS != "" {
						lCode.WBS = data.WBS
					}
					if data.MinimumEmployees != "" {
						min, _ := strconv.Atoi(data.MinimumEmployees)
						lCode.MinimumEmployees = min
					}
					if data.NotAssignedName != "" {
						lCode.NotAssignedName = data.NotAssignedName
					}
					if data.HoursPerEmployee != "" {
						hours, _ := strconv.ParseFloat(data.HoursPerEmployee, 64)
						lCode.HoursPerEmployee = hours
					}
					if data.Exercise != "" {
						lCode.Exercise = strings.EqualFold(data.Exercise, "true")
					}
					if data.StartDate != "" {
						sDate, _ := time.Parse("2006-01-02", data.StartDate)
						lCode.StartDate = sDate
					}
					if data.EndDate != "" {
						eDate, _ := time.Parse("2006-01-02", data.EndDate)
						lCode.EndDate = eDate
					}
					rpt.LaborCodes[l] = lCode
				}
			}
			if !found {
				lCode := sites.LaborCode{
					ChargeNumber: data.ChargeNumber,
					Extension:    data.Extension,
				}
				if data.CLIN != "" {
					lCode.CLIN = data.CLIN
				}
				if data.SLIN != "" {
					lCode.SLIN = data.SLIN
				}
				if data.Location != "" {
					lCode.Location = data.Location
				}
				if data.WBS != "" {
					lCode.WBS = data.WBS
				}
				if data.MinimumEmployees != "" {
					min, _ := strconv.Atoi(data.MinimumEmployees)
					lCode.MinimumEmployees = min
				}
				if data.NotAssignedName != "" {
					lCode.NotAssignedName = data.NotAssignedName
				}
				if data.HoursPerEmployee != "" {
					hours, _ := strconv.ParseFloat(data.HoursPerEmployee, 64)
					lCode.HoursPerEmployee = hours
				}
				if data.Exercise != "" {
					lCode.Exercise = strings.EqualFold(data.Exercise, "true")
				}
				if data.StartDate != "" {
					sDate, _ := time.Parse("2006-01-02", data.StartDate)
					lCode.StartDate = sDate
				}
				if data.EndDate != "" {
					eDate, _ := time.Parse("2006-01-02", data.EndDate)
					lCode.EndDate = eDate
				}
				rpt.LaborCodes = append(rpt.LaborCodes, lCode)
			}
			site.ForecastReports[r] = rpt
		}
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSiteLaborCode: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateSiteLaborCode: Created Site Labor Code: %s-%s", data.ChargeNumber,
		data.Extension))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func UpdateSiteLaborCode(c *gin.Context) {
	var data web.UpdateSiteLaborCode

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSiteLaborCode: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSiteLaborCode: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSiteLaborCode: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for r, rpt := range site.ForecastReports {
		if rpt.ID == data.ReportID {
			for l, lCode := range rpt.LaborCodes {
				if strings.EqualFold(lCode.ChargeNumber, data.ChargeNumber) &&
					strings.EqualFold(lCode.Extension, data.Extension) {
					switch strings.ToLower(data.Field) {
					case "clin":
						lCode.CLIN = data.Value
					case "slin":
						lCode.SLIN = data.Value
					case "location":
						lCode.Location = data.Value
					case "wbs":
						lCode.WBS = data.Value
					case "minimum", "min", "minimumemployees":
						min, _ := strconv.Atoi(data.Value)
						lCode.MinimumEmployees = min
					case "notassigned", "notassignedname":
						lCode.NotAssignedName = data.Value
					case "hours", "hoursperemployee":
						hours, _ := strconv.ParseFloat(data.Value, 64)
						lCode.HoursPerEmployee = hours
					case "exercise":
						lCode.Exercise = strings.EqualFold(data.Value, "true")
					case "start", "startdate":
						tdate, _ := time.Parse("2006-01-02", data.Value)
						lCode.StartDate = tdate
					case "end", "enddate":
						tdate, _ := time.Parse("2006-01-02", data.Value)
						lCode.EndDate = tdate
					}
					rpt.LaborCodes[l] = lCode
				}
			}
			site.ForecastReports[r] = rpt
		}
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSiteLaborCode: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateSiteLaborCode: Site Labor Code Updated: %s-%s", data.ChargeNumber,
		data.Extension))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func DeleteSiteLaborCode(c *gin.Context) {
	teamID := c.Param("teamid")
	siteID := c.Param("siteid")
	rptID, _ := strconv.Atoi(c.Param("reportid"))
	chgNo := c.Param("chgno")
	ext := c.Param("ext")

	site, err := services.GetSite(teamID, siteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteSiteLaborCode: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteSiteLaborCode: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for r, rpt := range site.ForecastReports {
		if rpt.ID == rptID {
			pos := -1
			for l, lCode := range rpt.LaborCodes {
				if strings.EqualFold(lCode.ChargeNumber, chgNo) &&
					strings.EqualFold(lCode.Extension, ext) {
					pos = l
				}
			}
			if pos >= 0 {
				rpt.LaborCodes = append(rpt.LaborCodes[:pos], rpt.LaborCodes[pos+1:]...)
			}
			site.ForecastReports[r] = rpt
		}
	}

	if err = services.UpdateSite(teamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteSiteLaborCode: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteSiteLaborCode: Site Labor Code Deleted: %s-%s", chgNo, ext))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func CreateSiteForecastReport(c *gin.Context) {
	var data web.CreateSiteForecast

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSiteForecastReport: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSiteForecastReport: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSiteForecastReport: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	fID := -1
	found := false
	for _, rpt := range site.ForecastReports {
		if strings.EqualFold(rpt.Name, data.Name) &&
			rpt.StartDate.Equal(data.StartDate) && rpt.EndDate.Equal(data.EndDate) {
			found = true
		}
		if fID < rpt.ID {
			fID = rpt.ID
		}
	}
	if !found {
		rpt := sites.ForecastReport{
			ID:        fID + 1,
			Name:      data.Name,
			StartDate: data.StartDate,
			EndDate:   data.EndDate,
		}
		rpt.ChangePeriodsStart(data.Period)
		site.ForecastReports = append(site.ForecastReports, rpt)
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSiteForecastReport: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateSiteForecastReport: Created Forecast Report: %s", data.Name))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func UpdateSiteForecastReport(c *gin.Context) {
	var data web.UpdateSiteForecast

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSiteForecastReport: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSiteForecastReport: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSiteForecastReport: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for r, rpt := range site.ForecastReports {
		if rpt.ID == data.ReportID {
			switch strings.ToLower(data.Field) {
			case "name":
				rpt.Name = data.Value
			case "start", "startdate":
				tDate, _ := time.Parse("2006-01-02", data.Value)
				rpt.StartDate = tDate
			case "end", "enddate":
				tDate, _ := time.Parse("2006-01-02", data.Value)
				rpt.EndDate = tDate
			case "addlabor", "addlaborcode":
				parts := strings.Split(data.Value, "|")
				found := false
				for _, lc := range rpt.LaborCodes {
					if strings.EqualFold(lc.ChargeNumber, parts[0]) &&
						strings.EqualFold(lc.Extension, parts[1]) {
						found = true
					}
				}
				if !found {
					lc := sites.LaborCode{
						ChargeNumber: parts[0],
						Extension:    parts[1],
					}
					rpt.LaborCodes = append(rpt.LaborCodes, lc)
				}
			case "deletelabor", "deletelaborcode":
				parts := strings.Split(data.Value, "|")
				found := -1
				for l, lc := range rpt.LaborCodes {
					if strings.EqualFold(lc.ChargeNumber, parts[0]) &&
						strings.EqualFold(lc.Extension, parts[1]) {
						found = l
					}
				}
				if found >= 0 {
					rpt.LaborCodes = append(rpt.LaborCodes[:found],
						rpt.LaborCodes[found+1:]...)
				}
			case "period":
				weekday, _ := strconv.Atoi(data.Value)
				rpt.ChangePeriodsStart(weekday)
			case "move", "moveperiod":
				parts := strings.Split(data.Value, "|")
				fromDate, _ := time.Parse("2006-01-02", parts[0])
				toDate, _ := time.Parse("2006-01-02", parts[1])
				rpt.MovePeriodBetweenMonths(fromDate, toDate)
			}
			site.ForecastReports[r] = rpt
		}
	}

	if err = services.UpdateSite(data.TeamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSiteForecastReport: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateSiteForecastReport: Forecast Report Updated: %s", data.Field))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func DeleteSiteForecastReport(c *gin.Context) {
	teamID := c.Param("teamid")
	siteID := c.Param("siteid")
	rptID, err := strconv.Atoi(c.Param("rptid"))

	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteSiteForecastReport: Report ID Convert: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
	}

	site, err := services.GetSite(teamID, siteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteSiteForecastReport: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteSiteForecastReport: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	found := -1
	for i, rpt := range site.ForecastReports {
		if rpt.ID == rptID {
			found = i
		}
	}
	if found < 0 {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteSiteForecastReport: Forecast Report Not Found: %s - %d", siteID,
			rptID))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: "Report Not Found"})
		return
	}

	site.ForecastReports = append(site.ForecastReports[:found],
		site.ForecastReports[found+1:]...)
	if err = services.UpdateSite(teamID, *site); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteSiteForecastReport: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteSiteForecastReport: Forecast Report Deleted: %s-%d", siteID, rptID))
	c.JSON(http.StatusOK, web.SiteResponse{Team: nil, Site: site, Exception: ""})
}

func CreateSiteCofSReport(c *gin.Context) {
	var data web.NewCofSReport

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSiteCofSReport: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSiteCofSReport: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateSiteCofSReport: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	cID := 0
	found := false
	for _, rpt := range site.CofSReports {
		if rpt.ID > cID {
			cID = rpt.ID
		}
		if strings.EqualFold(rpt.Name, data.Name) ||
			strings.EqualFold(rpt.ShortName, data.ShortName) {
			found = true
		}
	}
	if !found {
		rpt := sites.CofSReport{
			ID:             cID + 1,
			Name:           data.Name,
			AssociatedUnit: data.Unit,
			ShortName:      data.ShortName,
			StartDate:      data.StartDate,
			EndDate:        data.EndDate,
		}
		site.CofSReports = append(site.CofSReports, rpt)
	}

	err = services.UpdateSite(data.TeamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateSiteCofSReport: Update Site: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil,
			Site: nil, Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateSiteCofSReport: CofS Report Created: %s", data.Name))
	c.JSON(http.StatusOK,
		web.SiteResponse{
			Team: nil, Site: site, Exception: "",
		})
}

func UpdateSiteCofSReport(c *gin.Context) {
	var data web.UpdateCofSReport

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSiteCofSReport: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	site, err := services.GetSite(data.TeamID, data.SiteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSiteCofSReport: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateSiteCofSReport: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	for r, rpt := range site.CofSReports {
		if rpt.ID == data.ReportID {
			switch strings.ToLower(data.Field) {
			case "name":
				rpt.Name = data.Value
			case "unit":
				rpt.AssociatedUnit = data.Value
			case "short", "shortname":
				rpt.ShortName = data.Value
			case "startdate":
				dt, err := time.ParseInLocation("01/02/2006",
					data.Value, time.UTC)
				if err != nil {
					svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
						"UpdateSiteCofSReport: Start Date Convert: %s", err.Error()))
					c.JSON(http.StatusBadRequest, web.SiteResponse{
						Team: nil, Site: nil,
						Exception: err.Error()})
					return
				}
				rpt.StartDate = dt
			case "enddate":
				dt, err := time.ParseInLocation("01/02/2006",
					data.Value, time.UTC)
				if err != nil {
					svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
						"UpdateSiteCofSReport: End Date Convert: %s", err.Error()))
					c.JSON(http.StatusBadRequest, web.SiteResponse{
						Team: nil, Site: nil,
						Exception: err.Error()})
					return
				}
				rpt.EndDate = dt
			case "dates":
				dtparts := strings.Split(data.Value, "|")
				if len(dtparts) > 1 {
					dt, err := time.ParseInLocation("01/02/2006",
						data.Value, time.UTC)
					if err != nil {
						svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
							"UpdateSiteCofSReport: Dates Convert (Start): %s", err.Error()))
						c.JSON(http.StatusBadRequest, web.SiteResponse{
							Team: nil, Site: nil,
							Exception: err.Error()})
						return
					}
					rpt.StartDate = dt
					dt, err = time.ParseInLocation("01/02/2006",
						data.Value, time.UTC)
					if err != nil {
						svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
							"UpdateSiteCofSReport: Date Convert (End): %s", err.Error()))
						c.JSON(http.StatusBadRequest, web.SiteResponse{
							Team: nil, Site: nil,
							Exception: err.Error()})
						return
					}
					rpt.EndDate = dt
				}
			case "addcompany":
				found := false
				sort := -1
				for _, co := range rpt.Companies {
					if strings.EqualFold(co.ID, data.Value) {
						found = true
						if co.SortID > sort {
							sort = co.SortID
						}
					}
				}
				if !found {
					co := sites.CofSCompany{
						ID:             data.Value,
						SignatureBlock: "",
						SortID:         sort + 1,
					}
					rpt.Companies = append(rpt.Companies, co)
				}
			case "delcompany":
				found := false
				for i := 0; i < len(rpt.Companies) && !found; i++ {
					if strings.EqualFold(rpt.Companies[i].ID, data.Value) {
						found = true
						rpt.Companies = append(rpt.Companies[:i], rpt.Companies[i+1:]...)
					}
				}
			case "signature":
				for c, co := range rpt.Companies {
					if strings.EqualFold(co.ID, data.CompanyID) {
						co.SignatureBlock = data.Value
						rpt.Companies[c] = co
					}
				}
			case "exercises":
				for c, co := range rpt.Companies {
					if strings.EqualFold(co.ID, data.CompanyID) {
						val, _ := strconv.ParseBool(data.Value)
						co.AddExercises = val
						rpt.Companies[c] = co
					}
				}
			case "addlabor":
				for c, co := range rpt.Companies {
					if strings.EqualFold(co.ID, data.CompanyID) {
						parts := strings.Split(data.Value, "-")
						found := false
						for _, lc := range co.LaborCodes {
							if strings.EqualFold(lc.ChargeNumber, parts[0]) &&
								strings.EqualFold(lc.Extension, parts[1]) {
								found = true
							}
						}
						if !found {
							lc := sites.LaborCode{
								ChargeNumber: parts[0],
								Extension:    parts[1],
							}
							co.LaborCodes = append(co.LaborCodes, lc)
						}
						rpt.Companies[c] = co
					}
				}
			case "dellabor":
				for c, co := range rpt.Companies {
					if strings.EqualFold(co.ID, data.CompanyID) {
						parts := strings.Split(data.Value, "-")
						found := false
						for l := 0; l < len(co.LaborCodes) && !found; l++ {
							lc := co.LaborCodes[l]
							if strings.EqualFold(lc.ChargeNumber, parts[0]) &&
								strings.EqualFold(lc.Extension, parts[1]) {
								found = true
								co.LaborCodes = append(co.LaborCodes[:l],
									co.LaborCodes[l+1:]...)
							}
						}
						rpt.Companies[c] = co
					}
				}
			case "sort":
				sort.Sort(sites.ByCofSCompany(rpt.Companies))
				for c, co := range rpt.Companies {
					if strings.EqualFold(co.ID, data.CompanyID) {
						if strings.EqualFold(data.Value, "up") &&
							c > 0 {
							oldsort := co.SortID
							co.SortID = rpt.Companies[c-1].SortID
							rpt.Companies[c-1].SortID = oldsort
						} else if strings.EqualFold(data.Value, "down") &&
							c < len(rpt.Companies)-1 {
							oldsort := co.SortID
							co.SortID = rpt.Companies[c+1].SortID
							rpt.Companies[c+1].SortID = oldsort
						}
						rpt.Companies[c] = co
					}
				}
			}
		}
		site.CofSReports[r] = rpt
	}

	err = services.UpdateSite(data.TeamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateSiteCofSReport: UpdateSite: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil,
			Site: nil, Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateSiteCofSReport: CofS Updated: %s", data.Field))
	c.JSON(http.StatusOK,
		web.SiteResponse{
			Team: nil, Site: site, Exception: "",
		})
}

func DeleteCofSReport(c *gin.Context) {
	teamID := c.Param("teamid")
	siteID := c.Param("siteid")
	rptID, err := strconv.Atoi(c.Param("rptid"))
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteCofSReport: Report ID Convert: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
			Exception: err.Error()})
	}

	site, err := services.GetSite(teamID, siteID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteCofSReport: GetSite: %s", "Site Not Found"))
			c.JSON(http.StatusNotFound, web.SiteResponse{Team: nil, Site: nil,
				Exception: "Site Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteCofSReport: GetSite: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil, Site: nil,
				Exception: err.Error()})
		}
		return
	}

	found := -1
	for r, rpt := range site.CofSReports {
		if rpt.ID == rptID {
			found = r
		}
	}
	if found >= 0 {
		site.CofSReports = append(site.CofSReports[:found],
			site.CofSReports[found+1:]...)
	}

	err = services.UpdateSite(teamID, *site)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteCofSReport: Update Site: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.SiteResponse{Team: nil,
			Site: nil, Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteCofSReport: CofS Report Deleted: %d", rptID))
	c.JSON(http.StatusOK,
		web.SiteResponse{
			Team: nil, Site: site, Exception: "",
		})
}
