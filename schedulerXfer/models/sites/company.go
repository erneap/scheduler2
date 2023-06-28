package sites

import "time"

type CompanyHoliday struct {
	ID          string      `json:"id" bson:"id"`
	Name        string      `json:"name" bson:"name"`
	SortID      uint        `json:"sort" bson:"sort"`
	ActualDates []time.Time `json:"actualdates,omitempty" bson:"actualdates,omitempty"`
}

type ByCompanyHoliday []CompanyHoliday

func (c ByCompanyHoliday) Len() int { return len(c) }
func (c ByCompanyHoliday) Less(i, j int) bool {
	return c[i].SortID < c[j].SortID
}
func (c ByCompanyHoliday) Swap(i, j int) { c[i], c[j] = c[j], c[i] }

func (ch *CompanyHoliday) GetActual(year int) *time.Time {
	start := time.Date(year, 1, 1, 0, 0, 0, 0, time.UTC)
	end := time.Date(year+1, 1, 1, 0, 0, 0, 0, time.UTC)
	for _, actual := range ch.ActualDates {
		if (actual.Equal(start) || actual.After(start)) && actual.Before(end) {
			return &actual
		}
	}
	return nil
}

type Company struct {
	ID         string           `json:"id" bson:"id"`
	Name       string           `json:"name" bson:"name"`
	IngestType string           `json:"ingest" bson:"ingest"`
	IngestPwd  string           `json:"ingestPwd" bson:"ingestPwd"`
	Holidays   []CompanyHoliday `json:"holidays,omitempty" bson:"holidays,omitempty"`
}

type ByCompany []Company

func (c ByCompany) Len() int { return len(c) }
func (c ByCompany) Less(i, j int) bool {
	return c[i].Name < c[j].Name
}
func (c ByCompany) Swap(i, j int) { c[i], c[j] = c[j], c[i] }
