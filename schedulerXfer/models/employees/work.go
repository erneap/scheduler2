package employees

import (
	"sort"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type EmployeeLaborCode struct {
	ChargeNumber string `json:"chargeNumber"`
	Extension    string `json:"extension"`
}

type ByEmployeeLaborCode []EmployeeLaborCode

func (c ByEmployeeLaborCode) Len() int { return len(c) }
func (c ByEmployeeLaborCode) Less(i, j int) bool {
	if c[i].ChargeNumber == c[j].ChargeNumber {
		return c[i].Extension < c[j].Extension
	}
	return c[i].ChargeNumber < c[j].ChargeNumber
}
func (c ByEmployeeLaborCode) Swap(i, j int) { c[i], c[j] = c[j], c[i] }

type Work struct {
	DateWorked   time.Time `json:"dateWorked"`
	ChargeNumber string    `json:"chargeNumber"`
	Extension    string    `json:"extension"`
	PayCode      int       `json:"payCode"`
	Hours        float64   `json:"hours"`
}

type ByEmployeeWork []Work

func (c ByEmployeeWork) Len() int { return len(c) }
func (c ByEmployeeWork) Less(i, j int) bool {
	if c[i].DateWorked.Equal(c[j].DateWorked) {
		if c[i].ChargeNumber == c[j].ChargeNumber {
			return c[i].Extension < c[j].Extension
		}
		return c[i].ChargeNumber < c[j].ChargeNumber
	}
	return c[i].DateWorked.Before(c[j].DateWorked)
}
func (c ByEmployeeWork) Swap(i, j int) { c[i], c[j] = c[j], c[i] }

type EmployeeWorkRecord struct {
	ID         primitive.ObjectID `json:"id" bson:"_id"`
	EmployeeID primitive.ObjectID `json:"employeeID" bson:"employeeID"`
	Year       uint               `json:"year" bson:"year"`
	Work       []Work             `json:"work,omitempty" bson:"work,omitempty"`
}

type ByEmployeeWorkRecord []EmployeeWorkRecord

func (c ByEmployeeWorkRecord) Len() int { return len(c) }
func (c ByEmployeeWorkRecord) Less(i, j int) bool {
	if c[i].EmployeeID.Hex() == c[j].EmployeeID.Hex() {
		return c[i].Year < c[j].Year
	}
	return c[i].EmployeeID.Hex() < c[j].EmployeeID.Hex()
}
func (c ByEmployeeWorkRecord) Swap(i, j int) { c[i], c[j] = c[j], c[i] }

func (e *EmployeeWorkRecord) RemoveWork(start, end time.Time) {
	startPos := -1
	endPos := -1
	sort.Sort(ByEmployeeWork(e.Work))

	for i, wk := range e.Work {
		if startPos < 0 && (wk.DateWorked.Equal(start) || wk.DateWorked.After(start)) &&
			(wk.DateWorked.Equal(end) || wk.DateWorked.Before(end)) {
			startPos = i
		} else if startPos >= 0 && (wk.DateWorked.Equal(start) ||
			wk.DateWorked.After(start)) && (wk.DateWorked.Equal(end) ||
			wk.DateWorked.Before(end)) {
			endPos = i
		}
		if startPos >= 0 {
			if endPos < 0 {
				endPos = startPos
			}
			e.Work = append(e.Work[:startPos], e.Work[endPos+1:]...)
		}
	}
}
