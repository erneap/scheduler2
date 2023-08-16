package ingest

import (
	"fmt"
	"log"
	"mime/multipart"
	"strconv"
	"strings"
	"time"

	"github.com/xuri/excelize/v2"
)

type ManualExcelIngest struct {
	Files     []*multipart.FileHeader
	StartDate time.Time
	Password  string
}

func (mei *ManualExcelIngest) Process() ([]ExcelRow, time.Time,
	time.Time) {
	start := time.Now()
	end := time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	var records []ExcelRow
	for _, file := range mei.Files {
		recs, fStart, fEnd := mei.ProcessFile(file)
		records = append(records, recs...)
		if fStart.Before(start) {
			start = fStart
		}
		if fEnd.After(end) {
			end = fEnd
		}
	}
	return records, start, end
}

func (mei *ManualExcelIngest) ProcessFile(file *multipart.FileHeader) ([]ExcelRow,
	time.Time, time.Time) {
	name := file.Filename
	wkctr := ""
	parts := strings.Split(name, "_")
	if len(parts) > 0 {
		parts = strings.Split(parts[0], "-")
		if len(parts) > 0 {
			wkctr = strings.ToLower(parts[0])
		}
	}
	fmt.Println(wkctr)

	readerFile, _ := file.Open()
	options := excelize.Options{
		Password: mei.Password,
	}
	f, err := excelize.OpenReader(readerFile, options)
	if err != nil {
		log.Println(err)
	}
	sheetName := f.GetSheetName(0)

	rows, err := f.GetRows(sheetName)
	if err != nil {
		log.Println(err)
	}
	startDate := time.Now()
	endDate := time.Date(1970, 1, 1, 0, 0, 0, 0, time.UTC)
	var records []ExcelRow

	for i, row := range rows {
		if i > 1 {
			empName := ""

			for c, col := range row {
				switch c {
				case 0:
					empName = col
				case 1:
				default:
					date := mei.StartDate.AddDate(0, 0, c-3)
					if endDate.Before(date) {
						endDate = date
					}
					val, err := strconv.ParseFloat(col, 64)
					if err != nil {
						record := ExcelRow{
							Date:      date,
							CompanyID: empName,
							Code:      col,
						}
						records = append(records, record)
					} else {
						record := ExcelRow{
							Date:         date,
							CompanyID:    empName,
							ChargeNumber: wkctr,
							Extension:    strconv.Itoa(date.Year()),
							Hours:        val,
						}
						records = append(records, record)
					}
				}
			}
		}
	}

	return records, startDate, endDate
}
