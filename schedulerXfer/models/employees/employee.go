package employees

import (
	"errors"
	"log"
	"sort"
	"strconv"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Employee struct {
	ID     primitive.ObjectID `json:"id" bson:"_id"`
	TeamID primitive.ObjectID `json:"team" bson:"team"`
	SiteID string             `json:"site" bson:"site"`
	UserID primitive.ObjectID `json:"userid" bson:"userid"`
	Name   EmployeeName       `json:"name" bson:"name"`
	Data   EmployeeData       `json:"data" bson:"data"`
	Work   []Work             `json:"work,omitempty"`
}

type ByEmployees []Employee

func (c ByEmployees) Len() int { return len(c) }
func (c ByEmployees) Less(i, j int) bool {
	if c[i].Name.LastName == c[j].Name.LastName {
		if c[i].Name.FirstName == c[j].Name.FirstName {
			return c[i].Name.MiddleName < c[j].Name.MiddleName
		}
		return c[i].Name.FirstName < c[j].Name.FirstName
	}
	return c[i].Name.LastName < c[j].Name.LastName
}
func (c ByEmployees) Swap(i, j int) { c[i], c[j] = c[j], c[i] }

func (e *Employee) RemoveLeaves(start, end time.Time) {
	sort.Sort(ByLeaveDay(e.Data.Leaves))
	startpos := -1
	endpos := -1
	for i, lv := range e.Data.Leaves {
		if startpos < 0 && (lv.LeaveDate.Equal(start) || lv.LeaveDate.After(start)) &&
			(lv.LeaveDate.Equal(end) || lv.LeaveDate.Before(end)) {
			startpos = i
		} else if startpos >= 0 && (lv.LeaveDate.Equal(start) || lv.LeaveDate.After(start)) &&
			(lv.LeaveDate.Equal(end) || lv.LeaveDate.Before(end)) {
			endpos = i
		}
	}
	if startpos >= 0 {
		if endpos < 0 {
			endpos = startpos
		}
		e.Data.Leaves = append(e.Data.Leaves[:startpos], e.Data.Leaves[endpos+1:]...)
	}
}

type EmployeeName struct {
	FirstName  string `json:"first"`
	MiddleName string `json:"middle"`
	LastName   string `json:"last"`
	Suffix     string `json:"suffix"`
}

type EmployeeData struct {
	CompanyInfo CompanyInfo         `json:"companyinfo"`
	Assignments []Assignment        `json:"assignments,omitempty"`
	Variations  []Variation         `json:"variations,omitempty"`
	Balances    []AnnualLeave       `json:"balance,omitempty"`
	Leaves      []LeaveDay          `json:"leaves,omitempty"`
	Requests    []LeaveRequest      `json:"requests,omitempty"`
	LaborCodes  []EmployeeLaborCode `json:"laborCodes,omitempty"`
}

func (e *EmployeeData) IsAssigned(site, workcenter string, start, end time.Time) bool {
	answer := false
	for _, asgmt := range e.Assignments {
		if strings.EqualFold(asgmt.Site, site) &&
			strings.EqualFold(asgmt.Workcenter, workcenter) &&
			asgmt.StartDate.After(end) && asgmt.EndDate.Before((start)) {
			answer = true
		}
	}
	return answer
}

func (e *EmployeeData) AtSite(site string, start, end time.Time) bool {
	answer := false
	for _, asgmt := range e.Assignments {
		if strings.EqualFold(asgmt.Site, site) &&
			asgmt.StartDate.After(end) && asgmt.EndDate.Before((start)) {
			answer = true
		}
	}
	return answer
}

func (e *EmployeeData) GetWorkday(date time.Time) *Workday {
	var wkday *Workday = nil
	var siteid string = ""
	for _, asgmt := range e.Assignments {
		if (asgmt.StartDate.Before(date) || asgmt.StartDate.Equal(date)) &&
			(asgmt.EndDate.After(date) || asgmt.EndDate.Equal(date)) {
			siteid = asgmt.Site
			wkday = asgmt.GetWorkday(asgmt.Site, date)
		}
	}
	for _, vari := range e.Variations {
		if (vari.StartDate.Before(date) || vari.StartDate.Equal(date)) &&
			(vari.EndDate.After(date) || vari.EndDate.Equal(date)) {
			wkday = vari.GetWorkday(siteid, date)
		}
	}
	return wkday
}

func (e *EmployeeData) GetStandardWorkday(date time.Time) float64 {
	answer := 8.0
	count := 0
	start := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0,
		time.UTC)
	end := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, time.UTC)
	for start.Weekday() != time.Sunday {
		start = start.AddDate(0, 0, -1)
	}
	for end.Weekday() != time.Saturday {
		end = end.AddDate(0, 0, 1)
	}
	for start.Before(end) || start.Equal(end) {
		wd := e.GetWorkday(start)
		if wd.Code != "" {
			count++
		}
	}
	if count < 5 {
		answer = 10.0
	}
	return answer
}

func (e *EmployeeData) RemoveAssignment(id uint) {
	pos := -1
	for i, asgmt := range e.Assignments {
		if asgmt.ID == id {
			pos = i
		}
	}
	if pos >= 0 {
		e.Assignments = append(e.Assignments[:pos], e.Assignments[pos+1:]...)
	}
}

func (e *EmployeeData) PurgeOldData(date time.Time) {
	// purge old assignments based on assignment end date
	sort.Sort(ByAssignment(e.Assignments))
	for i := len(e.Assignments) - 1; i >= 0; i-- {
		if e.Assignments[i].EndDate.Before(date) {
			e.Assignments = append(e.Assignments[:i], e.Assignments[i+1:]...)
		}
	}
	// purge old variations based on variation end date
	sort.Sort(ByVariation(e.Variations))
	for i := len(e.Variations) - 1; i >= 0; i-- {
		if e.Variations[i].EndDate.Before(date) {
			e.Variations = append(e.Variations[:i], e.Variations[i+1:]...)
		}
	}
}

func (e *EmployeeData) UpdateAnnualLeave(year int, annual, carry float64) {
	found := false
	for _, al := range e.Balances {
		if al.Year == year {
			found = true
			al.Annual = annual
			al.Carryover = carry
		}
	}
	if !found {
		al := AnnualLeave{
			Year:      year,
			Annual:    annual,
			Carryover: carry,
		}
		e.Balances = append(e.Balances, al)
		sort.Sort(ByBalance(e.Balances))
	}
}

func (e *EmployeeData) UpdateLeave(date time.Time, code, status string,
	hours float64, requestID *primitive.ObjectID) {
	found := false
	for _, lv := range e.Leaves {
		if lv.LeaveDate.Equal(date) {
			found = true
			lv.Code = code
			lv.Status = status
			lv.Hours = hours
			if requestID != nil {
				lv.RequestID = requestID.Hex()
			}
		}
	}
	if !found {
		lv := LeaveDay{
			LeaveDate: date,
			Code:      code,
			Hours:     hours,
			Status:    status,
			RequestID: requestID.Hex(),
		}
		e.Leaves = append(e.Leaves, lv)
		sort.Sort(ByLeaveDay(e.Leaves))
	}
}

func (e *EmployeeData) NewLeaveRequest(empID, code string, start, end time.Time) {
	lr := LeaveRequest{
		ID:          primitive.NewObjectID().Hex(),
		EmployeeID:  empID,
		RequestDate: time.Now().UTC(),
		PrimaryCode: code,
		StartDate:   start,
		EndDate:     end,
		Status:      "REQUESTED",
	}
	sDate := time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0,
		time.UTC)
	std := e.GetStandardWorkday(sDate)
	for sDate.Before(end) || sDate.Equal(end) {
		wd := e.GetWorkday(sDate)
		if wd.Code != "" {
			hours := wd.Hours
			if hours == 0.0 {
				hours = std
			}
			if code == "H" {
				hours = 8.0
			}
			lv := LeaveDay{
				LeaveDate: sDate,
				Code:      code,
				Hours:     hours,
				Status:    "REQUESTED",
				RequestID: lr.ID,
			}
			lr.RequestedDays = append(lr.RequestedDays, lv)
		}
		sDate = sDate.AddDate(0, 0, 1)
	}
	e.Requests = append(e.Requests, lr)
	sort.Sort(ByLeaveRequest(e.Requests))
}

func (e *EmployeeData) UpdateLeaveRequest(request, field, value string) error {
	for i, req := range e.Requests {
		if req.ID == request {
			switch strings.ToLower(field) {
			case "startdate", "start":
				lvDate, err := time.Parse("2006-01-02", value)
				if err != nil {
					return err
				}
				req.StartDate = lvDate
				req.Status = "REQUESTED"
				// reset the leave dates
				req.SetLeaveDays(e)
			case "enddate", "end":
				lvDate, err := time.Parse("2006-01-02", value)
				if err != nil {
					return err
				}
				req.EndDate = lvDate
				req.Status = "REQUESTED"
				// reset the leave dates
				req.SetLeaveDays(e)
			case "code", "primarycode":
				req.PrimaryCode = value
				log.Println(req.PrimaryCode)
			case "dates":
				parts := strings.Split(value, "|")
				start, err := time.ParseInLocation("2006-01-02", parts[0], time.UTC)
				if err != nil {
					return err
				}
				end, err := time.ParseInLocation("2006-01-02", parts[1], time.UTC)
				if err != nil {
					return nil
				}
				req.StartDate = time.Date(start.Year(), start.Month(), start.Day(), 0,
					0, 0, 0, time.Local)
				req.EndDate = time.Date(end.Year(), end.Month(), end.Day(), 0, 0, 0, 0,
					time.Local)
				sort.Sort(ByLeaveDay(req.RequestedDays))
				begin := -1
				last := -1
				for j, lv := range req.RequestedDays {
					if lv.LeaveDate.Before(req.StartDate) {
						begin = j
					} else if lv.LeaveDate.After(req.EndDate) && last < 0 {
						last = j
					}
				}
				if begin >= 0 && last >= 0 {
					req.RequestedDays = req.RequestedDays[begin+1 : last]
				} else if begin >= 0 {
					req.RequestedDays = req.RequestedDays[begin+1:]
				} else if last >= 0 {
					req.RequestedDays = req.RequestedDays[:last]
				}
				for start.Before(end) || start.Equal(end) {
					found := false
					for _, lv := range req.RequestedDays {
						if lv.LeaveDate.Equal(start) {
							found = true
						}
					}
					if !found {
						wd := e.GetWorkday(start)
						log.Println(start.Format("2006-01-02") + " - |" + strconv.FormatInt(int64(len(wd.Code)), 10) + "|")
						if wd.Code != "" {
							hours := wd.Hours
							if req.PrimaryCode == "H" {
								hours = 8.0
							} else if hours == 0.0 {
								hours = e.GetStandardWorkday(start)
							}
							lv := LeaveDay{
								LeaveDate: start,
								Code:      req.PrimaryCode,
								Hours:     hours,
								Status:    "REQUESTED",
								RequestID: req.ID,
							}
							req.RequestedDays = append(req.RequestedDays, lv)
						}
					}
					start = start.AddDate(0, 0, 1)
				}
			case "approve":
				req.ApprovedBy = value
				req.ApprovalDate = time.Now().UTC()
				req.Status = "APPROVED"
				var deletes []int
				for _, rLv := range req.RequestedDays {
					found := false
					for j, lv := range e.Leaves {
						if lv.LeaveDate.Equal(rLv.LeaveDate) {
							found = true
							if rLv.Code != "" && !found {
								if lv.Status != "ACTUAL" {
									lv.Code = rLv.Code
									lv.Hours = rLv.Hours
									lv.Status = "APPROVED"
									lv.RequestID = rLv.RequestID
									e.Leaves[j] = lv
								}
								if !found {
									rLv.Status = "APPROVED"
									e.Leaves = append(e.Leaves, rLv)
									if strings.ToLower(rLv.Code) == "h" && rLv.Hours == 8.0 {
										std := e.GetStandardWorkday(rLv.LeaveDate)
										if std > rLv.Hours {
											lv := LeaveDay{
												LeaveDate: rLv.LeaveDate,
												Code:      "V",
												Hours:     std - rLv.Hours,
												Status:    "APPROVED",
												RequestID: req.ID,
											}
											e.Leaves = append(e.Leaves, lv)
										}
									}
								}
							} else if !found {
								deletes = append(deletes, j)
							}
						}
					}
				}
				if len(deletes) > 0 {
					for i := len(deletes) - 1; i >= 0; i-- {
						e.Leaves = append(e.Leaves[:deletes[i]], e.Leaves[deletes[i]-1:]...)
					}
				}
				sort.Sort(ByLeaveDay(e.Leaves))
			case "day", "requestday":
				parts := strings.Split(value, "|")
				lvDate, _ := time.Parse("2006-01-02", parts[0])
				code := parts[1]
				hours, _ := strconv.ParseFloat(parts[2], 64)
				found := false
				for j, lv := range req.RequestedDays {
					if lv.LeaveDate.Equal(lvDate) {
						found = true
						lv.Code = code
						if code == "" {
							lv.Hours = 0.0
						} else {
							lv.Hours = hours
						}
						req.RequestedDays[j] = lv
					}
				}
				req.Status = "REQUESTED"
				if !found {
					lv := LeaveDay{
						LeaveDate: lvDate,
						Code:      code,
						Hours:     hours,
						Status:    "REQUESTED",
						RequestID: req.ID,
					}
					req.RequestedDays = append(req.RequestedDays, lv)
				}
			}
			e.Requests[i] = req
		}
	}
	return nil
}

func (e *EmployeeData) DeleteLeaveRequest(request string) error {
	pos := -1
	for i, req := range e.Requests {
		if req.ID == request {
			pos = i
		}
	}
	if pos < 0 {
		return errors.New("request not found")
	}
	e.Requests = append(e.Requests[:pos], e.Requests[pos+1:]...)
	// delete all leaves associated with this leave request, except if the leave
	// has a status of actual
	sort.Sort(ByLeaveDay(e.Leaves))
	var deletes []int
	for i, lv := range e.Leaves {
		if lv.RequestID == request && strings.ToLower(lv.Status) != "actual" {
			deletes = append(deletes, i)
		}
	}
	if len(deletes) > 0 {
		for i := len(deletes) - 1; i >= 0; i-- {
			e.Leaves = append(e.Leaves[:deletes[i]], e.Leaves[deletes[i]+1:]...)
		}
	}
	return nil
}

func (e *EmployeeData) HasLaborCode(chargeNumber, extension string) bool {
	found := false
	for _, lc := range e.LaborCodes {
		if lc.ChargeNumber == chargeNumber && lc.Extension == extension {
			found = true
		}
	}
	return found
}

func (e *EmployeeData) AddLaborCode(chargeNo, ext string) {
	if !e.HasLaborCode(chargeNo, ext) {
		lc := EmployeeLaborCode{
			ChargeNumber: chargeNo,
			Extension:    ext,
		}
		e.LaborCodes = append(e.LaborCodes, lc)
	}
}

func (e *EmployeeData) DeleteLaborCode(chargeNo, ext string) {
	if e.HasLaborCode(chargeNo, ext) {
		pos := -1
		for i, lc := range e.LaborCodes {
			if lc.ChargeNumber == chargeNo && lc.Extension == ext {
				pos = i
			}
		}
		if pos >= 0 {
			e.LaborCodes = append(e.LaborCodes[:pos], e.LaborCodes[pos+1:]...)
		}
	}
}
