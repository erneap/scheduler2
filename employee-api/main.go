package main

import (
	"fmt"

	"github.com/erneap/go-models/config"
	"github.com/erneap/go-models/svcs"
	"github.com/erneap/scheduler2/employee-api/controllers"
	"github.com/gin-gonic/gin"
)

func main() {
	fmt.Println("Starting")

	// run database
	config.ConnectDB()

	// add routes
	router := gin.Default()
	roles := []string{"ADMIN", "SCHEDULER", "siteleader", "company", "teamleader"}
	api := router.Group("/scheduler/api/v2")
	{
		api.GET("/:userid", svcs.CheckJWT("scheduler"), controllers.GetInitial)
		emp := api.Group("/employee")
		{
			emp.GET("/:empid", svcs.CheckJWT("scheduler"), controllers.GetEmployee)
			emp.POST("/", svcs.CheckJWT("scheduler"), svcs.CheckRoles("scheduler", roles),
				controllers.CreateEmployee)
			emp.PUT("/", svcs.CheckJWT("scheduler"), controllers.UpdateEmployeeBasic)
			emp.DELETE("/:empid", svcs.CheckJWT("scheduler"), controllers.DeleteEmployee)
			asgmt := emp.Group("/assignment").Use(svcs.CheckJWT("scheduler"))
			{
				asgmt.POST("/", controllers.CreateEmployeeAssignment)
				asgmt.PUT("/", controllers.UpdateEmployeeAssignment)
				asgmt.PUT("/workday", controllers.UpdateEmployeeAssignmentWorkday)
				asgmt.DELETE("/:empid/:asgmtid",
					controllers.DeleteEmployeeAssignment)
			}
			vari := emp.Group("/variation").Use(svcs.CheckJWT("scheduler"))
			{
				vari.POST("/", controllers.CreateEmployeeVariation)
				vari.PUT("/", controllers.UpdateEmployeeVariation)
				vari.PUT("/workday", controllers.UpdateEmployeeVariationWorkday)
				vari.DELETE("/:empid/:variid", controllers.DeleteEmployeeVariation)
			}
			balance := emp.Group("/balance").Use(svcs.CheckJWT("scheduler"))
			{
				balance.POST("/", controllers.CreateEmployeeLeaveBalance)
				balance.PUT("/", controllers.UpdateEmployeeLeaveBalance)
				balance.DELETE("/:empid/:year", controllers.DeleteEmployeeLeaveBalance)
			}
			leaves := emp.Group("/leaves").Use(svcs.CheckJWT("scheduler"))
			{
				leaves.POST("/", controllers.AddEmployeeLeaveDay)
				leaves.PUT("/", controllers.UpdateEmployeeLeaveDay)
				leaves.DELETE("/:empid/:lvid", controllers.DeleteEmployeeLeaveDay)
			}
			lvReq := emp.Group("/request").Use(svcs.CheckJWT("scheduler"))
			{
				lvReq.POST("/", controllers.CreateEmployeeLeaveRequest)
				lvReq.PUT("/", controllers.UpdateEmployeeLeaveRequest)
				lvReq.DELETE("/:empid/:reqid", controllers.DeleteEmployeeLeaveRequest)
			}
			lCode := emp.Group("/laborcode").Use(svcs.CheckJWT("scheduler"))
			{
				lCode.POST("/", controllers.AddEmployeeLaborCode)
				lCode.DELETE("/:empid/:asgmt/:chgno/:ext", controllers.DeleteEmployeeLaborCode)
			}
			emp.GET("/work/:employee/:year", controllers.GetEmployeeWork)
			emp.POST("/contact", controllers.UpdateContact)
			emp.POST("/specialty", controllers.UpdateSpecialty)
			emp.POST("/specialties", controllers.UpdateSpecialties)
		}
	}

	// listen on port 6002
	router.Run(":7001")
}
