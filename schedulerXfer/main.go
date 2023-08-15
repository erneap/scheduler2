package main

import (
	"fmt"

	"github.com/erneap/go-models/config"
	"github.com/erneap/scheduler/schedulerXfer/converters"
)

func main() {
	fmt.Println("Starting")

	config.ConnectDB()

	baseLoc := "/Users/antonerne/Projects/scheduler/DatabaseExport"

	fmt.Println("Copying Users")
	userConvert := converters.UserConverter{}
	userConvert.ReadUsers()
	userConvert.WriteUsers()

	teamConvert := converters.TeamConverter{
		BaseLocation: baseLoc,
	}
	teamConvert.ReadTeam()
	teamConvert.ReadCompanyHolidayDates()
	teamConvert.ReadForecastReports()
	team := teamConvert.WriteTeam()

	employeeConvert := converters.EmployeeConverter{
		BaseLocation: baseLoc,
		Team:         *team,
		SiteID:       "dgsc",
	}
	employeeConvert.GetTeamInfo()
	employeeConvert.GetUsers()
	employeeConvert.ReadEmployees()
	employeeConvert.Write()
}
