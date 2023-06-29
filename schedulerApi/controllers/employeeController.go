package controllers

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/erneap/go-models/converters"
	"github.com/erneap/go-models/employees"
	"github.com/erneap/go-models/notifications"
	"github.com/erneap/go-models/svcs"
	"github.com/erneap/go-models/users"
	"github.com/erneap/scheduler2/schedulerApi/models/web"
	"github.com/erneap/scheduler2/schedulerApi/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetInitial(c *gin.Context) {
	id := c.Param("userid")

	emp, err := services.GetEmployee(id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.InitialResponse{
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.InitialResponse{
				Exception: err.Error()})
		}
		return
	}

	teamid := emp.TeamID
	siteid := emp.SiteID

	team, err := services.GetTeam(teamid.Hex())
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.InitialResponse{
				Exception: "Employee's Team Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.InitialResponse{
				Exception: err.Error()})
		}
		return
	}

	site, err := services.GetSite(teamid.Hex(), siteid)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.InitialResponse{
				Exception: "Employee's Site Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.InitialResponse{
				Exception: err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, web.InitialResponse{
		Team:      team,
		Site:      site,
		Employee:  emp,
		Exception: "",
	})
}

func GetEmployee(c *gin.Context) {
	empID := c.Param("empid")

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployee(c *gin.Context) {
	var data web.NewEmployeeRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	// The service checks for the employee and updates if present in the database,
	// but if not present, creates a new employee.
	emp, err := services.CreateEmployee(data.Employee, data.Password, "",
		data.TeamID, data.SiteID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
	}
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

// basic update includes name and company information which is unlike to change
// much.
func UpdateEmployeeBasic(c *gin.Context) {
	var data users.UpdateRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	// Get the Employee through the data service
	emp, err := services.GetEmployee(data.UserID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	user, err := svcs.GetUserByID(data.UserID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}
	// update the corresponding field
	switch strings.ToLower(data.Field) {
	case "first", "firstname":
		emp.Name.FirstName = data.Value
		if user != nil {
			user.FirstName = data.Value
		}
	case "middle", "middlename":
		emp.Name.MiddleName = data.Value
		if user != nil {
			user.MiddleName = data.Value
		}
	case "last", "lastname":
		emp.Name.LastName = data.Value
		if user != nil {
			user.LastName = data.Value
		}
	case "email", "emailaddress":
		emp.Email = data.Value
		if user != nil {
			user.EmailAddress = data.Value
		}
	case "suffix":
		emp.Name.Suffix = data.Value
	case "company":
		emp.Data.CompanyInfo.Company = data.Value
	case "employeeid", "companyid":
		emp.Data.CompanyInfo.EmployeeID = data.Value
	case "alternateid", "alternate":
		emp.Data.CompanyInfo.AlternateID = data.Value
	case "jobtitle", "title":
		emp.Data.CompanyInfo.JobTitle = data.Value
	case "rank", "grade":
		emp.Data.CompanyInfo.Rank = data.Value
	case "costcenter":
		emp.Data.CompanyInfo.CostCenter = data.Value
	case "division":
		emp.Data.CompanyInfo.Division = data.Value
	case "unlock":
		if user != nil {
			user.BadAttempts = 0
		}
	case "addworkgroup", "addperm", "addpermission":
		if user != nil {
			wg := "scheduler-" + data.Value
			found := false
			for _, wGroup := range user.Workgroups {
				if strings.EqualFold(wGroup, wg) {
					found = true
				}
			}
			if !found {
				user.Workgroups = append(user.Workgroups, wg)
			}
		}
	case "removeworkgroup", "remove", "removeperm", "removepermission":
		if user != nil {
			wg := "scheduler-" + data.Value
			pos := -1
			for i, wGroup := range user.Workgroups {
				if strings.EqualFold(wGroup, wg) {
					pos = i
				}
			}
			if pos >= 0 {
				user.Workgroups = append(user.Workgroups[:pos],
					user.Workgroups[pos+1:]...)
			}
		}
	}

	// send the employee back to the service for update.
	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// send user back to services for update
	if user != nil {
		svcs.UpdateUser(*user)
	}
	emp.User = user

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployeeAssignment(c *gin.Context) {
	var newAsgmt web.NewEmployeeAssignment

	if err := c.ShouldBindJSON(&newAsgmt); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	// get the employee from the id provided
	emp, err := services.GetEmployee(newAsgmt.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	emp.AddAssignment(newAsgmt.SiteID, newAsgmt.Workcenter, newAsgmt.StartDate)

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeAssignment(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, asgmt := range emp.Data.Assignments {
		if asgmt.ID == data.AssignmentID {
			switch strings.ToLower(data.Field) {
			case "site":
				asgmt.Site = data.Value
			case "workcenter":
				asgmt.Workcenter = data.Value
			case "start", "startdate":
				asgmt.StartDate = converters.ParseDate(data.Value)
			case "end", "enddate":
				asgmt.EndDate = converters.ParseDate(data.Value)
			case "rotationdate":
				asgmt.RotationDate = converters.ParseDate(data.Value)
			case "rotationdays":
				asgmt.RotationDays = converters.ParseInt(data.Value)
			case "addschedule":
				asgmt.AddSchedule(converters.ParseInt(data.Value))
			case "changeschedule":
				asgmt.ChangeScheduleDays(data.ScheduleID, converters.ParseInt(data.Value))
			case "removeschedule":
				asgmt.RemoveSchedule(data.ScheduleID)
			}
			emp.Data.Assignments[i] = asgmt
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeAssignmentWorkday(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, asgmt := range emp.Data.Assignments {
		if asgmt.ID == data.AssignmentID {
			for j, sch := range asgmt.Schedules {
				if sch.ID == data.ScheduleID {
					for k, wd := range sch.Workdays {
						if wd.ID == data.WorkdayID {
							switch strings.ToLower(data.Field) {
							case "workcenter":
								wd.Workcenter = data.Value
							case "code":
								wd.Code = data.Value
							case "hours":
								wd.Hours = converters.ParseFloat(data.Value)
							}
							sch.Workdays[k] = wd
							asgmt.Schedules[j] = sch
							emp.Data.Assignments[i] = asgmt
						}
					}
				}
			}
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeAssignment(c *gin.Context) {
	empID := c.Param("empid")
	asgmtID, err := strconv.ParseUint(c.Param("asgmtid"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	emp.RemoveAssignment(uint(asgmtID))

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployee(c *gin.Context) {
	empID := c.Param("empid")

	err := services.DeleteEmployee(empID)
	if err != nil {
		c.JSON(http.StatusBadRequest, notifications.Message{Message: err.Error()})
	}
	c.JSON(http.StatusOK, notifications.Message{Message: "employee deleted"})
}

func CreateEmployeeVariation(c *gin.Context) {
	var data web.NewEmployeeVariation

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	max := uint(0)
	for _, vari := range emp.Data.Variations {
		if vari.ID > max {
			max = vari.ID
		}
	}
	data.Variation.ID = max + 1

	emp.Data.Variations = append(emp.Data.Variations, data.Variation)
	sort.Sort(employees.ByVariation(emp.Data.Variations))

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeVariation(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, vari := range emp.Data.Variations {
		if vari.ID == data.AssignmentID {
			switch strings.ToLower(data.Field) {
			case "site":
				vari.Site = data.Value
			case "mids", "ismids":
				vari.IsMids = converters.ParseBoolean(data.Value)
			case "start", "startdate":
				vari.StartDate = converters.ParseDate(data.Value)
			case "end", "enddate":
				vari.EndDate = converters.ParseDate(data.Value)
			case "changeschedule":
				vari.Schedule.SetScheduleDays(converters.ParseInt(data.Value))
			case "resetschedule":
				workcenter := ""
				code := ""
				hours := 0.0
				var workdays []time.Weekday
				start := time.Date(vari.StartDate.Year(), vari.StartDate.Month(),
					vari.StartDate.Day(), 0, 0, 0, 0, time.UTC)
				for start.Weekday() != time.Sunday {
					start = start.AddDate(0, 0, -1)
				}
				for i, wd := range vari.Schedule.Workdays {
					wDate := start.AddDate(0, 0, i)
					if hours <= 0.0 && wd.Hours > 0.0 {
						workcenter = wd.Workcenter
						code = wd.Code
						hours = wd.Hours
						found := false
						for _, wday := range workdays {
							if wday == wDate.Weekday() {
								found = true
							}
						}
						if !found {
							workdays = append(workdays, wDate.Weekday())
						}
					}
				}
				vari.SetScheduleDays()
				sort.Sort(employees.ByWorkday(vari.Schedule.Workdays))

				count := uint(0)
				for start.Before(vari.EndDate) || start.Equal(vari.EndDate) {
					count++
					wd := vari.Schedule.Workdays[count]
					if start.Equal(vari.StartDate) || start.After(vari.StartDate) {
						found := false
						for _, wDay := range workdays {
							if start.Weekday() == wDay {
								found = true
							}
						}
						if found {
							wd.Workcenter = workcenter
							wd.Code = code
							wd.Hours = hours
						} else {
							wd.Workcenter = ""
							wd.Code = ""
							wd.Hours = float64(0.0)
						}
					}
					vari.Schedule.Workdays[count] = wd
					start = start.AddDate(0, 0, 1)
				}
			}
		}
		emp.Data.Variations[i] = vari
	}

	sort.Sort(employees.ByVariation(emp.Data.Variations))

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeVariationWorkday(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, vari := range emp.Data.Variations {
		if vari.ID == data.AssignmentID {
			for k, wd := range vari.Schedule.Workdays {
				if wd.ID == data.WorkdayID {
					switch strings.ToLower(data.Field) {
					case "workcenter":
						wd.Workcenter = data.Value
					case "code":
						wd.Code = data.Value
					case "hours":
						wd.Hours = converters.ParseFloat(data.Value)
					}
					vari.Schedule.Workdays[k] = wd
					emp.Data.Variations[i] = vari
				}
			}
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeVariation(c *gin.Context) {
	empID := c.Param("empid")
	variID, err := strconv.ParseUint(c.Param("variid"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	pos := -1
	for i, vari := range emp.Data.Variations {
		if vari.ID == uint(variID) {
			pos = i
		}
	}
	if pos >= 0 {
		emp.Data.Variations = append(emp.Data.Variations[:pos],
			emp.Data.Variations[pos+1:]...)
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployeeLeaveBalance(c *gin.Context) {
	var data web.LeaveBalanceRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	emp.CreateLeaveBalance(data.Year)

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeLeaveBalance(c *gin.Context) {
	var data users.UpdateRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.UserID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	year, err := strconv.Atoi(data.OptionalID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	fvalue, err := strconv.ParseFloat(data.Value, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	for i, lb := range emp.Data.Balances {
		if lb.Year == year {
			if strings.ToLower(data.Field) == "annual" {
				lb.Annual = fvalue
			} else {
				lb.Carryover = fvalue
			}
			emp.Data.Balances[i] = lb
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLeaveBalance(c *gin.Context) {
	empID := c.Param("empid")
	year, err := strconv.ParseInt(c.Param("year"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	pos := -1
	for i, bal := range emp.Data.Balances {
		if bal.Year == int(year) {
			pos = i
		}
	}
	if pos >= 0 {
		emp.Data.Balances = append(emp.Data.Balances[:pos],
			emp.Data.Balances[pos+1:]...)
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployeeLeaveRequest(c *gin.Context) {
	var data web.EmployeeLeaveRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	site, _ := services.GetSite(emp.TeamID.Hex(), emp.SiteID)
	data.StartDate = data.StartDate.Add(time.Hour * time.Duration(site.UtcOffset))
	data.EndDate = data.EndDate.Add(time.Hour * time.Duration(site.UtcOffset))
	emp.NewLeaveRequest(data.EmployeeID, data.Code, data.StartDate,
		data.EndDate, site.UtcOffset)

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeLeaveRequest(c *gin.Context) {
	var data users.UpdateRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.UserID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	site, _ := services.GetSite(emp.TeamID.Hex(), emp.SiteID)
	offset := 0.0
	if site != nil {
		offset = site.UtcOffset
	}

	err = emp.UpdateLeaveRequest(data.OptionalID, data.Field,
		data.Value, offset)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLeaveRequest(c *gin.Context) {
	empID := c.Param("empid")
	reqID := c.Param("reqid")

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	err = emp.DeleteLeaveRequest(reqID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func AddEmployeeLeaveDay(c *gin.Context) {
	var data web.EmployeeLeaveDayRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	emp.AddLeave(data.Leave.ID, data.Leave.LeaveDate, data.Leave.Code,
		data.Leave.Status, data.Leave.Hours, &primitive.NilObjectID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLeaveDay(c *gin.Context) {
	empID := c.Param("empid")
	sLvID := c.Param("lvid")

	emp, err := services.GetEmployee(empID)
	if err != nil {
		fmt.Println(err.Error())
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	lvID, err := strconv.Atoi(sLvID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	emp.DeleteLeave(lvID)

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeLeaveDay(c *gin.Context) {
	var data users.UpdateRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.UserID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	lvID, err := strconv.Atoi(data.OptionalID)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}
	err = emp.UpdateLeave(lvID, data.Field, data.Value)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func AddEmployeeLaborCode(c *gin.Context) {
	var data web.EmployeeLaborCodeRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	emp.AddLaborCode(data.ChargeNumber, data.Extension)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLaborCode(c *gin.Context) {
	empID := c.Param("empid")
	chgNo := c.Param("chgno")
	ext := c.Param("ext")

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	emp.DeleteLaborCode(chgNo, ext)

	err = services.UpdateEmployee(emp)
	if err != nil {
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}
