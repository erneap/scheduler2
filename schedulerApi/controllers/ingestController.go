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
	"github.com/erneap/go-models/logs"
	"github.com/erneap/go-models/notifications"
	"github.com/erneap/go-models/svcs"
	"github.com/erneap/scheduler2/schedulerApi/models/ingest"
	"github.com/erneap/scheduler2/schedulerApi/models/reports"
	"github.com/erneap/scheduler2/schedulerApi/models/web"
	"github.com/erneap/scheduler2/schedulerApi/services"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetIngestEmployees(c *gin.Context) {
	teamid := c.Param("teamid")
	siteid := c.Param("siteid")
	companyid := c.Param("company")
	uyear, err := strconv.ParseUint(c.Param("year"), 10, 32)
	if err != nil {
		uyear = uint64(time.Now().Year())
	}
	year := uint(uyear)

	companyEmployees, err := getEmployeesAfterIngest(teamid, siteid, companyid,
		year, year)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"GetIngestEmployees: GetEmployees: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.IngestResponse{Exception: err.Error()})
	}

	team, err := services.GetTeam(teamid)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"GetIngestEmployees: GetTeam: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.IngestResponse{Exception: err.Error()})
		return
	}

	ingestType := ""
	for _, co := range team.Companies {
		if co.ID == companyid {
			ingestType = co.IngestType
		}
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"GetIngestEmployees: Provided employees: %d", len(companyEmployees)))
	c.JSON(http.StatusOK, web.IngestResponse{
		Employees:  companyEmployees,
		IngestType: ingestType,
		Exception:  "",
	})
}

func getEmployeesAfterIngest(team, site, company string, startyear uint,
	endyear uint) ([]employees.Employee, error) {
	var companyEmployees []employees.Employee

	empls, err := services.GetEmployees(team, site)
	if err != nil {
		return companyEmployees, err
	}

	for _, emp := range empls {
		if emp.CompanyInfo.Company == company {
			// get work for current and previous years
			work, err := services.GetEmployeeWork(emp.ID.Hex(), startyear)
			if err == nil && len(work.Work) > 0 {
				emp.Work = append(emp.Work, work.Work...)
			}
			if endyear != startyear {
				work, err := services.GetEmployeeWork(emp.ID.Hex(), endyear)
				if err == nil && len(work.Work) > 0 {
					emp.Work = append(emp.Work, work.Work...)
				}
			}
			sort.Sort(employees.ByEmployeeWork(emp.Work))
			companyEmployees = append(companyEmployees, emp)
		}
	}
	sort.Sort(employees.ByEmployees(companyEmployees))

	return companyEmployees, nil
}

func IngestFiles(c *gin.Context) {
	form, _ := c.MultipartForm()
	teamid := form.Value["team"][0]
	siteid := form.Value["site"][0]
	companyid := form.Value["company"][0]

	team, err := services.GetTeam(teamid)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"IngestFiles: GetTeam: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.IngestResponse{Exception: "Team not found"})
		return
	}

	ingestType := "manual"
	startDay := 0
	var records []ingest.ExcelRow
	start := time.Now()
	end := time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)

	for _, co := range team.Companies {
		if co.ID == companyid {
			ingestType = co.IngestType
			startDay = co.IngestStartDay
		}
	}

	files := form.File["file"]
	switch strings.ToLower(ingestType) {
	case "sap":
		sapIngest := reports.SAPIngest{
			Files: files,
		}
		records, start, end = sapIngest.Process()
	}

	// ensure the start date is the start of the company's workweek as provided
	// in the company record.
	for int(start.Weekday()) != startDay {
		start = start.AddDate(0, 0, -1)
	}

	/////////////////////////////////////////////////////////////////////////////
	// Algorithm for updating the employee records for leave and work
	// 1) Get a list of all employees at the site
	// 2) Sort the records by employee id, date, then hours.
	// 3) Create a list of all employees covered by the records.
	// 4) Step through the list of employees and remove leaves and work for the
	//    period.
	// 5) Step through the record and add leaves/work objects to either the
	//    employee or employee's work record.  Update the employee after adding
	//    a leave or create a new employee work record if the employee doesn't
	//    have one create it, if already present, update it.
	/////////////////////////////////////////////////////////////////////////////

	empls, err := services.GetEmployees(teamid, siteid)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"IngestFiles: GetEmployees: %s", err.Error()))
		c.JSON(http.StatusBadRequest, notifications.Message{Message: err.Error()})
		return
	}
	sort.Sort(ingest.ByExcelRow(records))
	// step througn records to get list of employee ids, then step through this
	// list and remove leaves and work associated with these employees
	var employeeIDs []string
	for _, rec := range records {
		found := false
		for _, id := range employeeIDs {
			if rec.CompanyID == id {
				found = true
			}
		}
		if !found {
			employeeIDs = append(employeeIDs, rec.CompanyID)
		}
	}

	for _, id := range employeeIDs {
		for i, emp := range empls {
			if emp.CompanyInfo.Company == companyid &&
				emp.CompanyInfo.EmployeeID == id {
				emp.RemoveLeaves(start, end)
				services.UpdateEmployee(&emp)
				empls[i] = emp

				work, err := services.GetEmployeeWork(emp.ID.Hex(), uint(start.Year()))
				if err == nil {
					work.RemoveWork(start, end)
					services.UpdateEmployeeWork(work)
				}
				if start.Year() != end.Year() {
					work, err := services.GetEmployeeWork(emp.ID.Hex(), uint(end.Year()))
					if err == nil {
						work.RemoveWork(start, end)
						services.UpdateEmployeeWork(work)
					}
				}
			}
		}
	}

	for _, rec := range records {
		// find the employee in the employees list
		for i, emp := range empls {
			if emp.CompanyInfo.Company == companyid &&
				emp.CompanyInfo.EmployeeID == rec.CompanyID {
				if rec.Code != "" {
					// leave, so add to employee and update
					lvid := -1
					for _, lv := range emp.Leaves {
						if lvid < lv.ID {
							lvid = lv.ID
						}
					}
					lv := employees.LeaveDay{
						ID:        lvid + 1,
						LeaveDate: rec.Date,
						Code:      rec.Code,
						Hours:     rec.Hours,
						Status:    "ACTUAL",
						RequestID: "",
					}
					emp.Leaves = append(emp.Leaves, lv)
					empls[i] = emp
					err := services.UpdateEmployee(&emp)
					if err != nil {
						fmt.Println(err)
					}
				} else {
					// work object, so get work record object for employee and year, then
					// add it to the work record, update it in the database.
					wr := employees.Work{
						DateWorked:   rec.Date,
						ChargeNumber: rec.ChargeNumber,
						Extension:    rec.Extension,
						PayCode:      converters.ParseInt(rec.Preminum),
						Hours:        rec.Hours,
					}
					workrec, err := services.GetEmployeeWork(emp.ID.Hex(),
						uint(rec.Date.Year()))
					if err != nil {
						workrec = &employees.EmployeeWorkRecord{
							ID:         primitive.NewObjectID(),
							EmployeeID: emp.ID,
							Year:       uint(rec.Date.Year()),
						}
						workrec.Work = append(workrec.Work, wr)
						services.CreateEmployeeWork(workrec)
					} else {
						workrec.Work = append(workrec.Work, wr)
						services.UpdateEmployeeWork(workrec)
					}
				}
			}
		}
	}

	companyEmployees, err := getEmployeesAfterIngest(teamid, siteid, companyid,
		uint(start.Year()), uint(end.Year()))
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"IngestFiles: GetEmployeesAfterIngest: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.IngestResponse{Exception: err.Error()})
		return
	}

	svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
		"IngestFiles: Provided Employees for Company: %s", companyid))
	c.JSON(http.StatusOK, web.IngestResponse{
		Employees:  companyEmployees,
		IngestType: ingestType,
		Exception:  "",
	})
}

func ManualIngestActions(c *gin.Context) {
	var data web.ManualIngestChanges

	if err := c.ShouldBindJSON(&data); err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"ManualIngestActions: BindRequest: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: "Trouble with request"})
		return
	}

	// step through each employee change
	year := uint(time.Now().Year())
	for _, change := range data.Changes {
		if uint(change.Work.DateWorked.Year()) != year {
			year = uint(change.Work.DateWorked.Year())
		}
		// actions are different based on work or leave
		parts := strings.Split(change.ChangeType, "-")
		if parts[1] == "work" {
			work, err := services.GetEmployeeWork(change.EmployeeID,
				uint(change.Work.DateWorked.Year()))
			if err == nil {
				switch parts[0] {
				case "delete":
					for i := len(work.Work) - 1; i >= 0; i-- {
						wk := work.Work[i]
						if wk.DateWorked.Equal(change.Work.DateWorked) &&
							wk.ChargeNumber == change.Work.ChargeNumber &&
							wk.Extension == change.Work.Extension {
							work.Work = append(work.Work[:i], work.Work[i+1:]...)
						}
					}
				case "add":
					work.Work = append(work.Work, *change.Work)
				case "update":
					for i, wk := range work.Work {
						if wk.DateWorked.Equal(change.Work.DateWorked) {
							wk.Hours = change.Work.Hours
							work.Work[i] = wk
						}
					}
				}
				services.UpdateEmployeeWork(work)
			} else {
				empID, _ := primitive.ObjectIDFromHex(change.EmployeeID)
				work = &employees.EmployeeWorkRecord{
					ID:         primitive.NewObjectID(),
					EmployeeID: empID,
					Year:       uint(change.Work.DateWorked.Year()),
				}
				if parts[0] == "update" || parts[0] == "add" {
					work.Work = append(work.Work, *change.Work)
				}

				services.CreateEmployeeWork(work)
			}
		} else if parts[1] == "leave" {
			emp, err := services.GetEmployee(change.EmployeeID)
			if err == nil {
				switch parts[0] {
				case "delete":
					for i := len(emp.Leaves) - 1; i >= 0; i-- {
						lv := emp.Leaves[i]
						if lv.LeaveDate.Equal(change.Leave.LeaveDate) {
							emp.Leaves = append(emp.Leaves[:i],
								emp.Leaves[i+1:]...)
						}
					}
				case "add":
					emp.Leaves = append(emp.Leaves, *change.Leave)
				case "update":
					for i, lv := range emp.Leaves {
						if lv.LeaveDate.Equal(change.Leave.LeaveDate) {
							lv.Code = change.Leave.Code
							lv.Status = change.Leave.Status
							emp.Leaves[i] = lv
						}
					}
				}
				services.UpdateEmployee(emp)
			}
		}
	}
	companyEmployees, err := getEmployeesAfterIngest(data.TeamID, data.SiteID,
		data.CompanyID, year, year)
	if err != nil {
		svcs.AddLogEntry("scheduler", logs.Debug, fmt.Sprintf(
			"ManualIngestActions: GetEmployeesAfterIngest: %s", err.Error()))
		c.JSON(http.StatusBadRequest, web.IngestResponse{Exception: err.Error()})
	}

	svcs.AddLogEntry("scheduler", logs.Debug, "ManualIngestActions: "+
		"Provided company employees: "+data.CompanyID)
	c.JSON(http.StatusOK, web.IngestResponse{
		Employees:  companyEmployees,
		IngestType: "",
		Exception:  "",
	})
}
