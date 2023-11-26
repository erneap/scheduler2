package controllers

import (
	"fmt"
	"net/http"
	"time"

	"github.com/erneap/scheduler2/schedulerApi/models/web"
	"github.com/erneap/scheduler2/schedulerApi/services"
	"github.com/gin-gonic/gin"
)

func Purge(c *gin.Context) {
	sDate := c.Param("purge")
	format := "20060102"

	purgeDate, err := time.Parse(format, sDate)
	if err != nil {
		services.AddLogEntry(c, "scheduler", "ERROR", "PROBLEM",
			fmt.Sprintf("Purge Date Parsing Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: err.Error()})
		return
	}

	// purge employee work records prior to purge date.
	workrecords, err := services.GetEmployeeWorkForPurge(purgeDate)
	if err != nil {
		services.AddLogEntry(c, "scheduler", "ERROR", "PROBLEM",
			fmt.Sprintf("Get Work Records Problem: %s", err.Error()))
		c.JSON(http.StatusBadRequest,
			web.SiteResponse{Team: nil, Site: nil, Exception: err.Error()})
		return
	}

	for _, rec := range workrecords {
		rec.Purge(purgeDate)
		if len(rec.Work) > 0 {
			services.UpdateEmployeeWork(&rec)
		} else {
			services.DeleteEmployeeWork(rec.EmployeeID.Hex(), rec.Year)
		}
	}

	// purge employee's leave balance records,variations and leave before purge
	// date, plus check to see if employee quit before the purge date.

	// update teams of holiday dates before the purge date.
}
