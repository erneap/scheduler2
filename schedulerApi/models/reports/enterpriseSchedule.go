package reports

import (
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/erneap/go-models/employees"
	"github.com/erneap/go-models/sites"
	"github.com/erneap/go-models/teams"
	"github.com/erneap/scheduler2/schedulerApi/services"
	"github.com/xuri/excelize/v2"
)

type EnterpriseSchedule struct {
	Report      *excelize.File
	Date        time.Time
	Year        int
	TeamID      string
	SiteID      string
	Workcenters []sites.Workcenter
	Workcodes   map[string]bool
	Styles      map[string]int
	Employees   []employees.Employee
	Offset      float64
}

func (sr *EnterpriseSchedule) Create() error {
	sr.Styles = make(map[string]int)
	sr.Workcodes = make(map[string]bool)
	sr.Report = excelize.NewFile()
	sr.Date = time.Now().UTC()

	// get employees with assignments for the site that are assigned
	// during the year.
	startDate := time.Date(sr.Year, 1, 1, 0, 0, 0, 0, time.UTC)
	endDate := time.Date(sr.Year, 12, 31, 23, 59, 59, 0, time.UTC)
	emps, err := services.GetEmployeesForTeam(sr.TeamID)
	if err != nil {
		return err
	}

	for _, emp := range emps {
		if emp.AtSite(sr.SiteID, startDate, endDate) {
			// get timecard data/work hours for each employee
			// for time period.
			wr, err := services.GetEmployeeWork(emp.ID.Hex(), uint(startDate.Year()))
			if err == nil {
				emp.Work = append(emp.Work, wr.Work...)
			}
			if startDate.Year() != endDate.Year() {
				wr, err = services.GetEmployeeWork(emp.ID.Hex(), uint(endDate.Year()))
				if err == nil {
					emp.Work = append(emp.Work, wr.Work...)
				}
			}
			sr.Employees = append(sr.Employees, emp)
		}
	}

	// get the site's workcenters
	site, err := services.GetSite(sr.TeamID, sr.SiteID)
	if err != nil {
		return err
	}
	sr.Offset = site.UtcOffset
	sr.Workcenters = append(sr.Workcenters, site.Workcenters...)
	sort.Sort(sites.ByWorkcenter(sr.Workcenters))

	// create styles for display on each monthly sheet
	err = sr.CreateStyles()
	if err != nil {
		return err
	}

	// create monthly schedule for each month of the year
	for i := 0; i < 12; i++ {
		err = sr.AddMonth(i + 1)
		if err != nil {
			return err
		}
	}

	// add a leave legend sheet
	sr.CreateLegendSheet()

	// remove the provided sheet "Sheet1" from the workbook
	sr.Report.DeleteSheet("Sheet1")

	// save the file
	filename := "/tmp/siteschedule.xlsx"
	err = sr.Report.SaveAs(filename)

	// reload the file
	if err == nil {
		sr.Report, _ = excelize.OpenFile(filename)
	}

	return nil
}

func (sr *EnterpriseSchedule) CreateStyles() error {
	//get all the workcodes from the team object and create the
	// styles for each one, plus one for weekend (non-leave), and
	// even and odd non-leaves.  Also need style for month label and workcenter

	team, err := services.GetTeam(sr.TeamID)
	if err != nil {
		return err
	}

	for _, wc := range team.Workcodes {
		style, err := sr.Report.NewStyle(&excelize.Style{
			Border: []excelize.Border{
				{Type: "left", Color: "000000", Style: 1},
				{Type: "top", Color: "000000", Style: 1},
				{Type: "right", Color: "000000", Style: 1},
				{Type: "bottom", Color: "000000", Style: 1},
			},
			Fill: excelize.Fill{Type: "pattern", Color: []string{wc.BackColor}, Pattern: 1},
			Font: &excelize.Font{Bold: true, Size: 11, Color: wc.TextColor},
			Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center",
				WrapText: true},
		})
		if err != nil {
			return err
		}
		sr.Styles[wc.Id] = style
		sr.Workcodes[wc.Id] = strings.EqualFold(wc.BackColor, "FFFFFF")
	}

	style, err := sr.Report.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"C0C0C0"}, Pattern: 1},
		Font: &excelize.Font{Bold: true, Size: 11, Color: "000000"},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center",
			WrapText: true},
	})
	if err != nil {
		return err
	}
	sr.Styles["evenday"] = style

	style, err = sr.Report.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"CCFFFF"}, Pattern: 1},
		Font: &excelize.Font{Bold: true, Size: 11, Color: "000000"},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center",
			WrapText: true},
	})
	if err != nil {
		return err
	}
	sr.Styles["weekend"] = style

	style, err = sr.Report.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"00E6E6"}, Pattern: 1},
		Font: &excelize.Font{Bold: true, Size: 11, Color: "000000"},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center",
			WrapText: true},
	})
	if err != nil {
		return err
	}
	sr.Styles["evenend"] = style

	style, err = sr.Report.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"FFFFFF"}, Pattern: 1},
		Font: &excelize.Font{Bold: true, Size: 11, Color: "000000"},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center",
			WrapText: true},
	})
	if err != nil {
		return err
	}
	sr.Styles["weekday"] = style

	style, err = sr.Report.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"DE5D12"}, Pattern: 1},
		Font: &excelize.Font{Bold: true, Size: 11, Color: "000000"},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center",
			WrapText: true},
	})
	if err != nil {
		return err
	}
	sr.Styles["month"] = style

	style, err = sr.Report.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "000000", Style: 1},
			{Type: "top", Color: "000000", Style: 1},
			{Type: "right", Color: "000000", Style: 1},
			{Type: "bottom", Color: "000000", Style: 1},
		},
		Fill: excelize.Fill{Type: "pattern", Color: []string{"000000"}, Pattern: 1},
		Font: &excelize.Font{Bold: true, Size: 11, Color: "FFFFFF"},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center",
			WrapText: true},
	})
	if err != nil {
		return err
	}
	sr.Styles["workcenter"] = style
	return nil
}

func (sr *EnterpriseSchedule) AddMonth(monthID int) error {
	var employeeList []employees.Employee
	startDate := time.Date(sr.Year, time.Month(monthID), 1, 0, 0, 0, 0, time.UTC)
	endDate := startDate.AddDate(0, 1, 0)
	for _, emp := range sr.Employees {
		if emp.AtSite(sr.SiteID, startDate, endDate) {
			// determine if employee assigned during month
			employeeList = append(employeeList, emp)
		}
	}

	sort.Sort(employees.ByEmployees(employeeList))

	// create sheet for the month
	sheetLabel := startDate.Format("Jan06")
	var (
		size          = 1
		orientation   = "landscape"
		fitToHeight   = 1
		fitToWidth    = 1
		blackAndWhite = false
		fitToPage     = true
	)

	sr.Report.NewSheet(sheetLabel)
	options := excelize.ViewOptions{}
	options.ShowGridLines = &[]bool{false}[0]
	sr.Report.SetSheetView(sheetLabel, 0, &options)
	if err := sr.Report.SetPageLayout(sheetLabel,
		&excelize.PageLayoutOptions{
			Size:          &size,
			Orientation:   &orientation,
			FitToHeight:   &fitToHeight,
			FitToWidth:    &fitToWidth,
			BlackAndWhite: &blackAndWhite,
		}); err != nil {
		return err
	}
	sr.Report.SetSheetProps(sheetLabel, &excelize.SheetPropsOptions{
		FitToPage: &fitToPage,
	})

	// set all the column widths
	sr.Report.SetColWidth(sheetLabel, "A", "A", 17.0)
	endOfMonth := endDate.AddDate(0, 0, -1)
	endColumn := "AE"
	switch endOfMonth.Day() {
	case 28:
		endColumn = "AC"
	case 29:
		endColumn = "AD"
	case 31:
		endColumn = "AF"
	default:
		endColumn = "AE"
	}
	sr.Report.SetColWidth(sheetLabel, "B", endColumn, 4.0)

	// monthly headers to include month label and days of the month
	style := sr.Styles["weekday"]
	sr.Report.SetRowHeight(sheetLabel, 1, 20)
	sr.Report.SetRowHeight(sheetLabel, 2, 20)
	sr.Report.SetRowHeight(sheetLabel, 3, 20)

	current := time.Date(sr.Year, time.Month(monthID), 1, 0, 0, 0, 0, time.UTC)
	for current.Before(endDate) {
		styleID := "weekday"
		style = sr.Styles[styleID]
		sr.Report.SetCellStyle(sheetLabel, GetCellID(current.Day(), 0),
			GetCellID(current.Day(), 2), style)
		weekday := current.Format("Mon")
		sr.Report.SetCellValue(sheetLabel, GetCellID(current.Day(), 0),
			startDate.Format("Jan"))
		sr.Report.SetCellValue(sheetLabel, GetCellID(current.Day(), 1),
			weekday[0:1])
		sr.Report.SetCellValue(sheetLabel, GetCellID(current.Day(), 2),
			strconv.Itoa(current.Day()))
		current = current.AddDate(0, 0, 1)
	}

	row := 2
	for _, wc := range sr.Workcenters {
		row++
	}
	printrange := "$A$1:$" + endColumn + "$" + strconv.Itoa(row)
	if err := sr.Report.SetDefinedName(&excelize.DefinedName{
		Name:     "_xlnm.Print_Area",
		RefersTo: sheetLabel + "!" + printrange,
		Scope:    sheetLabel,
	}); err != nil {
		return err
	}
	return nil
}

func (sr *EnterpriseSchedule) CreateEmployeeRow(sheetLabel string,
	start, end time.Time, row int, emp *employees.Employee) {
	styleID := "weekday"
	if row%2 == 0 {
		styleID = "evenday"
	}
	style := sr.Styles[styleID]
	sr.Report.SetRowHeight(sheetLabel, row, 20)
	sr.Report.SetCellStyle(sheetLabel, GetCellID(0, row), GetCellID(0, row), style)
	sr.Report.SetCellValue(sheetLabel, GetCellID(0, row),
		emp.Name.LastName+", "+emp.Name.FirstName[0:1])

	current := time.Date(start.Year(), start.Month(), start.Day(), 0, 0, 0, 0,
		time.UTC)
	for current.Before(end) {
		wd := emp.GetWorkday(current, sr.Offset)
		code := ""
		styleID = "weekday"
		if wd != nil && wd.Code != "" {
			code = wd.Code
			if !sr.Workcodes[wd.Code] {
				styleID = wd.Code
			}
		}
		if styleID == "weekday" {
			if current.Weekday() == time.Saturday || current.Weekday() == time.Sunday {
				if row%2 == 0 {
					styleID = "evenend"
				} else {
					styleID = "weekend"
				}
			} else {
				if row%2 == 0 {
					styleID = "evenday"
				}
			}
		}
		style = sr.Styles[styleID]
		cellID := GetCellID(current.Day(), row)
		sr.Report.SetCellStyle(sheetLabel, cellID, cellID, style)
		sr.Report.SetCellValue(sheetLabel, cellID, code)
		current = current.AddDate(0, 0, 1)
	}
}

func (sr *EnterpriseSchedule) CreateLegendSheet() error {
	sheetLabel := "Legend"
	sr.Report.NewSheet(sheetLabel)
	options := excelize.ViewOptions{}
	options.ShowGridLines = &[]bool{false}[0]
	sr.Report.SetSheetView(sheetLabel, 0, &options)
	sr.Report.SetColWidth(sheetLabel, "A", "A", 30)

	team, err := services.GetTeam(sr.TeamID)
	if err != nil {
		return err
	}

	sort.Sort(teams.ByWorkcode(team.Workcodes))
	row := 0
	for _, wc := range team.Workcodes {
		if !strings.EqualFold(wc.BackColor, "ffffff") {
			row++
			sr.Report.SetRowHeight(sheetLabel, row, 20)
			style := sr.Styles[wc.Id]
			sr.Report.SetCellStyle(sheetLabel, GetCellID(0, row), GetCellID(0, row), style)
			sr.Report.SetCellValue(sheetLabel, GetCellID(0, row), wc.Title)
		}
	}
	return nil
}
