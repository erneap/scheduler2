package web

import "time"

type NewSiteRequest struct {
	TeamID string `json:"team"`
	SiteID string `json:"siteid"`
	Name   string `json:"name"`
}

type NewSiteWorkcenter struct {
	TeamID  string `json:"team"`
	SiteID  string `json:"siteid"`
	WkctrID string `json:"wkctrid"`
	Name    string `json:"name"`
}

type SiteWorkcenterUpdate struct {
	TeamID  string `json:"team"`
	SiteID  string `json:"siteid"`
	WkctrID string `json:"wkctrid"`
	Field   string `json:"field"`
	Value   string `json:"value"`
}

type NewWorkcenterPosition struct {
	TeamID     string `json:"team"`
	SiteID     string `json:"siteid"`
	WkctrID    string `json:"wkctrid"`
	PositionID string `json:"positionid"`
	Name       string `json:"name"`
}

type WorkcenterPositionUpdate struct {
	TeamID     string `json:"team"`
	SiteID     string `json:"siteid"`
	WkctrID    string `json:"wkctrid"`
	PositionID string `json:"positionid"`
	Field      string `json:"field"`
	Value      string `json:"value"`
}

type NewSiteLaborCode struct {
	TeamID           string `json:"team"`
	SiteID           string `json:"siteid"`
	ChargeNumber     string `json:"chargeNumber"`
	Extension        string `json:"extension"`
	CLIN             string `json:"clin,omitempty"`
	SLIN             string `json:"slin,omitempty"`
	Location         string `json:"location,omitempty"`
	WBS              string `json:"wbs,omitempty"`
	MinimumEmployees string `json:"minimumEmployees,omitempty"`
	NotAssignedName  string `json:"notAssignedName,omitempty"`
	HoursPerEmployee string `json:"hoursPerEmployee,omitempty"`
	Exercise         string `json:"exercise,omitempty"`
	StartDate        string `json:"startDate,omitempty"`
	EndDate          string `json:"endDate,omitempty"`
}

type UpdateSiteLaborCode struct {
	TeamID       string `json:"team"`
	SiteID       string `json:"siteid"`
	ChargeNumber string `json:"chargeNumber"`
	Extension    string `json:"extension"`
	Field        string `json:"field"`
	Value        string `json:"value"`
}

type CreateSiteForecast struct {
	TeamID    string    `json:"team"`
	SiteID    string    `json:"siteid"`
	Name      string    `json:"name"`
	StartDate time.Time `json:"startdate"`
	EndDate   time.Time `json:"enddate"`
}

type UpdateSiteForecast struct {
	TeamID   string `json:"team"`
	SiteID   string `json:"siteid"`
	ReportID int    `json:"reportid"`
	Field    string `json:"field"`
	Value    string `json:"value"`
}

type CreateTeamRequest struct {
	Name string `json:"name"`
}

type UpdateTeamRequest struct {
	TeamID       string `json:"teamid"`
	AdditionalID string `json:"additionalid,omitempty"`
	HolidayID    string `json:"holiday,omitempty"`
	Field        string `json:"field,omitempty"`
	Value        string `json:"value"`
}

type CreateTeamWorkcodeRequest struct {
	TeamID    string `json:"teamid"`
	Id        string `json:"id"`
	Title     string `json:"title"`
	StartTime uint64 `json:"start"`
	ShiftCode int    `json:"shiftCode"`
	IsLeave   bool   `json:"isLeave"`
	TextColor string `json:"textcolor"`
	BackColor string `json:"backcolor"`
}

type CreateTeamCompany struct {
	TeamID     string `json:"teamid"`
	ID         string `json:"id"`
	Name       string `json:"name"`
	IngestType string `json:"ingest"`
}

type CreateCompanyHoliday struct {
	TeamID    string `json:"teamid"`
	CompanyID string `json:"companyid"`
	HolidayID string `json:"holidayid"`
	Name      string `json:"name"`
	Actual    string `json:"actual,omitempty"`
}
