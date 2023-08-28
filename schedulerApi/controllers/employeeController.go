package controllers

import (
	"fmt"
	"net/http"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/erneap/go-models/config"
	"github.com/erneap/go-models/converters"
	"github.com/erneap/go-models/employees"
	"github.com/erneap/go-models/logs"
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
	logmsg := "EmployeeController: GetInitial: "

	emp, err := services.GetEmployee(id)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("%s GetEmployee, Employee Not Found: %s", logmsg, id))
			c.JSON(http.StatusNotFound, web.InitialResponse{
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("%s GetEmployee, %s: %s", logmsg, err.Error(), id))
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
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("%s GetTeam, Team Not Found: %s", logmsg, teamid.Hex()))
			c.JSON(http.StatusNotFound, web.InitialResponse{
				Exception: "Team Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("%s GetTeam, %s: %s", logmsg, err.Error(), teamid.Hex()))
			c.JSON(http.StatusBadRequest, web.InitialResponse{
				Exception: err.Error()})
		}
		return
	}

	site, err := services.GetSite(teamid.Hex(), siteid)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("%s GetSite, Site Not Found: %s", logmsg, siteid))
			c.JSON(http.StatusNotFound, web.InitialResponse{
				Exception: "Site Not Found"})
		} else {
			svcs.CreateLogEntry(time.Now().UTC(), "scheduler", logs.Debug,
				fmt.Sprintf("%s GetSite, %s: %s", logmsg, err.Error(), siteid))
			c.JSON(http.StatusBadRequest, web.InitialResponse{
				Exception: err.Error()})
		}
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug,
		fmt.Sprintf("%s provided initial data to %s", logmsg, emp.Name.GetLastFirst()))
	c.JSON(http.StatusOK, web.InitialResponse{
		Team:      team,
		Site:      site,
		Employee:  emp,
		Exception: "",
	})
}

func GetEmployee(c *gin.Context) {
	empID := c.Param("empid")
	logmsg := "EmployeeController: GetEmployee: "

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("%s Employee Not Found: %s", logmsg, empID))
			c.JSON(http.StatusNotFound, web.InitialResponse{
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("%s %s: %s", logmsg, err.Error(), empID))
			c.JSON(http.StatusBadRequest, web.InitialResponse{
				Exception: err.Error()})
		}
		return
	}
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployee(c *gin.Context) {
	var data web.NewEmployeeRequest
	logmsg := "EmployeeController: CreateEmployee:"

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			fmt.Sprintf("%s %s: %s", logmsg, "RequestDataBinding", err.Error()))
		if config.LogLevel >= int(logs.Debug) {
			svcs.CreateLogEntry(time.Now().UTC(), "scheduler", logs.Debug,
				"CreateEmployee, Request Data Binding, Trouble with request")
		}
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	// The service checks for the employee and updates if present in the database,
	// but if not present, creates a new employee.
	emp, err := services.CreateEmployee(data.Employee, data.Password, "",
		data.TeamID, data.SiteID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			fmt.Sprintf("%s %s: %s", logmsg, "Creation Error", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
	}
	svcs.AddLogEntry("scheduler", logs.Debug,
		fmt.Sprintf("%s %s: %s", logmsg, "Employee Created", emp.Name.GetLastFirst()))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

// basic update includes name and company information which is unlike to change
// much.
func UpdateEmployeeBasic(c *gin.Context) {
	var data users.UpdateRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeBasic, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	// Get the Employee through the data service
	emp, err := services.GetEmployee(data.ID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"UpdateEmployeeBasic, GetEmployee, Employee Not Found")
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				fmt.Sprintf("UpdateEmployeeBasic, GetEmployee, %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	user, err := svcs.GetUserByID(data.ID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			fmt.Sprintf("UpdateEmployeeBasic, GetUserById, %s", err.Error()))
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
		emp.CompanyInfo.Company = data.Value
	case "employeeid", "companyid":
		emp.CompanyInfo.EmployeeID = data.Value
	case "alternateid", "alternate":
		emp.CompanyInfo.AlternateID = data.Value
	case "jobtitle", "title":
		emp.CompanyInfo.JobTitle = data.Value
	case "rank", "grade":
		emp.CompanyInfo.Rank = data.Value
	case "costcenter":
		emp.CompanyInfo.CostCenter = data.Value
	case "division":
		emp.CompanyInfo.Division = data.Value
	case "password":
		if user != nil {
			user.SetPassword(data.Value)
		}
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
		svcs.AddLogEntry("scheduler", logs.Debug,
			fmt.Sprintf("UpdateEmployeeBasic, UpdateEmployee, %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// send user back to services for update
	if user != nil {
		err = svcs.UpdateUser(*user)
		svcs.AddLogEntry("scheduler", logs.Debug,
			fmt.Sprintf("UpdateEmployeeBasic, Update User, %s", err.Error()))
	}
	emp.User = user

	svcs.AddLogEntry("scheduler", logs.Debug,
		fmt.Sprintf("UpdateEmployeeBasic, Updated %s", data.Field))
	// return the corrected employee back to the client.
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployeeAssignment(c *gin.Context) {
	var newAsgmt web.NewEmployeeAssignment

	if err := c.ShouldBindJSON(&newAsgmt); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateEmployeeAssignment: DataBinding: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	// get the employee from the id provided
	emp, err := services.GetEmployee(newAsgmt.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeAssignment: UpdateEmployee: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeAssignment: GetEmployee: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	emp.AddAssignment(newAsgmt.SiteID, newAsgmt.Workcenter, newAsgmt.StartDate)

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateEmployeeAssignment: UpdateEmployee: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateEmployeeAssignment: Assignment Created: %s: %s", newAsgmt.EmployeeID,
		newAsgmt.StartDate.Format("01/02/06")))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeAssignment(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeAssignment, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeAssignment: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeAssignment: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, asgmt := range emp.Assignments {
		if asgmt.ID == data.AssignmentID {
			switch strings.ToLower(data.Field) {
			case "site":
				asgmt.Site = data.Value
			case "workcenter":
				asgmt.Workcenter = data.Value
			case "start", "startdate":
				asgmt.StartDate, err = time.ParseInLocation("2006-01-02", data.Value,
					time.UTC)
				if err != nil {
					svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
						"UpdateEmployeeAssignment: UpdateEmployee Problem: %s", err.Error()))
					c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
						Exception: err.Error()})
					return
				}
			case "end", "enddate":
				asgmt.EndDate, err = time.ParseInLocation("2006-01-02", data.Value,
					time.UTC)
				if err != nil {
					svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
						"UpdateEmployeeAssignment: UpdateEmployee Problem: %s", err.Error()))
					c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
						Exception: err.Error()})
					return
				}
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
			emp.Assignments[i] = asgmt
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeAssignment: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateEmployeeAssignment: Assignment Updated: %s: %d: %s", data.EmployeeID,
		data.AssignmentID, data.Field))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeAssignmentWorkday(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeAssignmentWorkday: DataBinding Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeAssignmentWorkday: GetEmployee Problem: %s",
				"Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeAssignmentWorkday: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, asgmt := range emp.Assignments {
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
							emp.Assignments[i] = asgmt
						}
					}
				}
			}
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeAssignmentWorkday: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateEmployeeAssignmentWorkday: Assignment Workday Updated: %s: %d: %s",
		data.EmployeeID,
		data.AssignmentID, data.Field))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeAssignment(c *gin.Context) {
	empID := c.Param("empid")
	asgmtID, err := strconv.ParseUint(c.Param("asgmtid"), 10, 32)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeAssignment: Assignment ID Conversion Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeAssignment: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeAssignment: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	emp.RemoveAssignment(uint(asgmtID))

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeAssignment: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteEmployeeAssignment: Assignment Deleted: %s: %d", empID, asgmtID))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployee(c *gin.Context) {
	empID := c.Param("empid")

	err := services.DeleteEmployee(empID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployee: DeleteEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, notifications.Message{Message: err.Error()})
		return
	}
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteEmployee: Employee Deleted: %s", empID))
	c.JSON(http.StatusOK, notifications.Message{Message: "employee deleted"})
}

func CreateEmployeeVariation(c *gin.Context) {
	var data web.NewEmployeeVariation

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"CreateEmployeeVariation, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeVariation: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeVariation: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	max := uint(0)
	for _, vari := range emp.Variations {
		if vari.ID > max {
			max = vari.ID
		}
	}
	data.Variation.ID = max + 1

	emp.Variations = append(emp.Variations, data.Variation)
	sort.Sort(employees.ByVariation(emp.Variations))

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateEmployeeVariation: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateEmployeeVariation: UpdateEmployee Problem: %s", err.Error()))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeVariation(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeVariation, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeVariation: UpdateEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeVariation: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, vari := range emp.Variations {
		if vari.ID == data.AssignmentID {
			switch strings.ToLower(data.Field) {
			case "site":
				vari.Site = data.Value
			case "mids", "ismids":
				vari.IsMids = converters.ParseBoolean(data.Value)
			case "start", "startdate":
				vari.StartDate, err = time.ParseInLocation("2006-01-02", data.Value,
					time.UTC)
				if err != nil {
					svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
						"UpdateEmployeeAssignment: UpdateEmployee Problem: %s", err.Error()))
					c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
						Exception: err.Error()})
					return
				}
			case "end", "enddate":
				vari.EndDate, err = time.ParseInLocation("2006-01-02", data.Value,
					time.UTC)
				if err != nil {
					svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
						"UpdateEmployeeAssignment: UpdateEmployee Problem: %s", err.Error()))
					c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
						Exception: err.Error()})
					return
				}
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
		emp.Variations[i] = vari
	}

	sort.Sort(employees.ByVariation(emp.Variations))

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeVariation: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateEmployeeVariation: Variation Updated: %s: %d: %s", data.EmployeeID,
		data.AssignmentID, data.Field))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeVariationWorkday(c *gin.Context) {
	var data web.ChangeAssignmentRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeVariationWorkday, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeVariationWorkday: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeVariationWorkday: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for i, vari := range emp.Variations {
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
					emp.Variations[i] = vari
				}
			}
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeVariationWorkday: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateEmployeeVariationWorkday: Variation Updated: %s: %d", data.EmployeeID,
		data.AssignmentID))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeVariation(c *gin.Context) {
	empID := c.Param("empid")
	variID, err := strconv.ParseUint(c.Param("variid"), 10, 32)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeVariation: Convert Variation ID Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeVariation: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeVariation: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	pos := -1
	for i, vari := range emp.Variations {
		if vari.ID == uint(variID) {
			pos = i
		}
	}
	if pos >= 0 {
		emp.Variations = append(emp.Variations[:pos],
			emp.Variations[pos+1:]...)
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeVariation: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteEmployeeVariation: Variation Created: %s: %d", empID, variID))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployeeLeaveBalance(c *gin.Context) {
	var data web.LeaveBalanceRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"CreateEmployeeLeaveBalance, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeLeaveBalance: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeLeaveBalance: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	emp.CreateLeaveBalance(data.Year)

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateEmployeeLeaveBalance: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateEmployeeLeaveBalance: Leave Balance Created: %s: %d", data.EmployeeID,
		data.Year))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeLeaveBalance(c *gin.Context) {
	var data users.UpdateRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeLeaveBalance, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.ID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeLeaveBalance: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeLeaveBalance: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	year, err := strconv.Atoi(data.OptionalID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeLeaveBalance: Convert Year Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	fvalue, err := strconv.ParseFloat(data.Value, 64)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeLeaveBalance: Convert Value Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	for i, lb := range emp.Balances {
		if lb.Year == year {
			if strings.ToLower(data.Field) == "annual" {
				lb.Annual = fvalue
			} else {
				lb.Carryover = fvalue
			}
			emp.Balances[i] = lb
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeLeaveBalance: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateEmployeeLeaveBalance: LeaveBalance Updated: %s", err.Error()))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLeaveBalance(c *gin.Context) {
	empID := c.Param("empid")
	year, err := strconv.ParseInt(c.Param("year"), 10, 32)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeLeaveBalance: Convert Year Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeLeaveBalance: UpdateEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeLeaveBalance: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	pos := -1
	for i, bal := range emp.Balances {
		if bal.Year == int(year) {
			pos = i
		}
	}
	if pos >= 0 {
		emp.Balances = append(emp.Balances[:pos],
			emp.Balances[pos+1:]...)
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeLeaveBalance: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"DeleteEmployeeLeaveBalance: LeaveBalance Deleted: %s: %d", empID, year))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func CreateEmployeeLeaveRequest(c *gin.Context) {
	var data web.EmployeeLeaveRequest

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"CreateEmployeeLeaveRequest, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeLeaveRequest: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"CreateEmployeeLeaveRequest: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	site, err := services.GetSite(emp.TeamID.Hex(), emp.SiteID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateEmployeeLeaveRequest: GetSite Problem: %s", err.Error()))
	}
	data.StartDate = data.StartDate.Add(time.Hour * time.Duration(site.UtcOffset))
	data.EndDate = data.EndDate.Add(time.Hour * time.Duration(site.UtcOffset))
	emp.NewLeaveRequest(data.EmployeeID, data.Code, data.StartDate,
		data.EndDate, site.UtcOffset)

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"CreateEmployeeLeaveRequest: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"CreateEmployeeLeaveRequest: Request Created: %s: %s", data.EmployeeID,
		data.StartDate.Format("01/02/06")))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeLeaveRequest(c *gin.Context) {
	var data users.UpdateRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeLeaveRequest, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.ID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeLeaveRequest: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"UpdateEmployeeLeaveRequest: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}
	site, err := services.GetSite(emp.TeamID.Hex(), emp.SiteID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeLeaveRequest: Retrieving Site Problem: %s", err.Error()))
	}
	offset := 0.0
	if site != nil {
		offset = site.UtcOffset
	}

	msg, err := emp.UpdateLeaveRequest(data.OptionalID, data.Field,
		data.Value, offset)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeLeaveRequest: Updating LeaveRequest Problem: %s",
			err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	if msg != "" {
		if strings.Contains(strings.ToLower(msg), "approved") {
			err = svcs.CreateMessage(emp.ID.Hex(), data.Value, msg)
			if err != nil {
				fmt.Println(err.Error())
			}
			to := []string{emp.User.EmailAddress}
			subj := "Leave Request Approved"
			err = svcs.SendMail(to, subj, msg)
			if err != nil {
				fmt.Println(err.Error())
			}
		} else {
			siteEmps, _ := services.GetEmployees(emp.TeamID.Hex(), emp.SiteID)
			var to []string
			for _, e := range siteEmps {
				if e.User.IsInGroup("scheduler", "siteleader") ||
					e.User.IsInGroup("scheduler", "scheduler") {
					to = append(to, e.User.EmailAddress)
					err = svcs.CreateMessage(e.ID.Hex(), emp.ID.Hex(), msg)
					if err != nil {
						fmt.Println(err.Error())
					}
				}
			}
			if len(to) > 0 {
				err = svcs.SendMail(to, "Leave Request Submitted", msg)
				if err != nil {
					fmt.Println(err.Error())
				}
			}
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"UpdateEmployeeLeaveRequest: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"UpdateEmployeeLeaveRequest: Updated Leave Request: %s: %s", data.ID,
		data.OptionalID))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLeaveRequest(c *gin.Context) {
	empID := c.Param("empid")
	reqID := c.Param("reqid")

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeLeaveRequest: GetEmployee Problem: %s", "Employee Not Found"))
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
				"DeleteEmployeeLeaveRequest: GetEmployee Problem: %s", err.Error()))
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	err = emp.DeleteLeaveRequest(reqID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeLeaveRequest: DeleteLeaveRequest Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"DeleteEmployeeLeaveRequest: UpdateEmployee Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug, "DeleteEmployeeLeaveRequest: "+
		"Deleted Leave Request: "+empID+": "+reqID)
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func AddEmployeeLeaveDay(c *gin.Context) {
	var data web.EmployeeLeaveDayRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"AddEmployeeLeaveDay, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"AddEmployeeLeaveDay: Updating Employee problem: Employee Not Found")
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"AddEmployeeLeaveDay: GetEmployee problem: "+err.Error())
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	emp.AddLeave(data.Leave.ID, data.Leave.LeaveDate, data.Leave.Code,
		data.Leave.Status, data.Leave.Hours, &primitive.NilObjectID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"AddEmployeeLeaveDay: Adding Leave problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"AddEmployeeLeaveDay: Updating Employee problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug,
		"AddEmployeeLeaveDay: LeaveDay added: "+data.EmployeeID+": "+data.Leave.Code+
			"-"+data.Leave.LeaveDate.Format("01/02/06"))
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLeaveDay(c *gin.Context) {
	empID := c.Param("empid")
	sLvID := c.Param("lvid")

	emp, err := services.GetEmployee(empID)
	if err != nil {
		fmt.Println(err.Error())
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"DeleteEmployeeLeaveDay: getEmployee Problem: Employee Not Found")
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"DeleteEmployeeLeaveDay: getEmployee Problem: "+err.Error())
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	lvID, err := strconv.Atoi(sLvID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"DeleteEmployeeLeaveDay: LeaveDayID Conversion: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	emp.DeleteLeave(lvID)

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"DeleteEmployeeLeaveDay: UpdateEmployee Problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug,
		"DeleteEmployeeLeaveDay: LeaveDay Deleted: "+sLvID)
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func UpdateEmployeeLeaveDay(c *gin.Context) {
	var data users.UpdateRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeLeaveDay, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.ID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"UpdateEmployeeLeaveDay: GetEmployee Problem: Employee Not Found")
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"UpdateEmployeeLeaveDay: getEmployee Problem: "+err.Error())
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	lvID, err := strconv.Atoi(data.OptionalID)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeLeaveDay: Converting LeaveID Problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}
	err = emp.UpdateLeave(lvID, data.Field, data.Value)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeLeaveDay: Employee UpdateLeave Problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"UpdateEmployeeLeaveDay: UpdateEmployee Problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug,
		"UpdateEmployeeLeaveDay: Leave Day Updated: "+data.ID+": "+
			data.OptionalID+":"+data.Field+"-"+data.Value)
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func AddEmployeeLaborCode(c *gin.Context) {
	var data web.EmployeeLaborCodeRequest
	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"AddEmployeeLaborCode, Request Data Binding, Trouble with request")
		c.JSON(http.StatusBadRequest,
			web.EmployeeResponse{Employee: nil, Exception: "Trouble with request"})
		return
	}

	emp, err := services.GetEmployee(data.EmployeeID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"AddEmployeeLaborCode: getEmployee Problem: Employee Not Found")
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"AddEmployeeLaborCode: getEmployee Problem: "+err.Error())
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for a, asgmt := range emp.Assignments {
		if asgmt.ID == uint(data.AssginmentID) {
			asgmt.AddLaborCode(data.ChargeNumber, data.Extension)
			emp.Assignments[a] = asgmt
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"AddEmployeeLaborCode: update employee problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug,
		"AddEmployeeLaborCode: Updated Employee: "+data.EmployeeID+":"+
			data.ChargeNumber+" - "+data.Extension)
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}

func DeleteEmployeeLaborCode(c *gin.Context) {
	empID := c.Param("empid")
	asgmtID := converters.ParseUint(c.Param("asgmt"))
	chgNo := c.Param("chgno")
	ext := c.Param("ext")

	emp, err := services.GetEmployee(empID)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"DeleteEmployeeLaborCode: getEmployee Problem: Employee Not Found")
			c.JSON(http.StatusNotFound, web.EmployeeResponse{Employee: nil,
				Exception: "Employee Not Found"})
		} else {
			svcs.AddLogEntry("scheduler", logs.Debug,
				"DeleteEmployeeLaborCode: getEmployee Problem: "+err.Error())
			c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
				Exception: err.Error()})
		}
		return
	}

	for a, asgmt := range emp.Assignments {
		if asgmt.ID == asgmtID {
			asgmt.RemoveLaborCode(chgNo, ext)
			emp.Assignments[a] = asgmt
		}
	}

	err = services.UpdateEmployee(emp)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug,
			"DeleteEmployeeLaborCode: Labor Code deletion problem: "+err.Error())
		c.JSON(http.StatusBadRequest, web.EmployeeResponse{Employee: nil,
			Exception: err.Error()})
		return
	}

	// return the corrected employee back to the client.
	svcs.AddLogEntry("scheduler", logs.Debug,
		"DeleteEmployeeLaborCode: Labor Code deleted: "+empID+":"+chgNo+
			" - "+ext)
	c.JSON(http.StatusOK, web.EmployeeResponse{Employee: emp, Exception: ""})
}
