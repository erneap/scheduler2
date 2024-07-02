import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-availability-month',
  templateUrl: './site-availability-month.component.html',
  styleUrls: ['./site-availability-month.component.scss']
})
export class SiteAvailabilityMonthComponent {
  months: string[] = new Array("January", "February", "March", "April", "May",
  "June", "July", "August", "September", "October", "November", "December");

  weekdays: string[] = new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");

  month: Date;
  monthLabel: string = '';
  daysInMonth: number = 30;
  wkctrStyle: string = "width: 1700px;";
  monthStyle: string = "width: 1300px;";
  dates: Date[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  workcenters: Workcenter[] = [];
  lastWorked: Date = new Date(0);
  monthForm: FormGroup;

  constructor(
    protected siteService: SiteService,
    private fb: FormBuilder
  ) {
    this.month = new Date();
    this.month = new Date(this.month.getUTCFullYear(), this.month.getUTCMonth(), 1);
    this.monthForm = this.fb.group({
      month: this.month.getUTCMonth(),
      year: this.month.getUTCFullYear(),
    })
    this.setMonth();
  }
  
  setMonth() {
    this.monthLabel = `${this.months[this.month.getUTCMonth()]} `
      + `${this.month.getUTCFullYear()}`;
    
    // calculate the display's start and end date, where start date is always
    // the sunday before the 1st of the month and end date is the saturday after
    // the end of the month.
    this.startDate = new Date(Date.UTC(this.month.getUTCFullYear(), 
      this.month.getUTCMonth(), 1, 0, 0, 0));
    this.endDate = new Date(Date.UTC(this.month.getUTCFullYear(), 
      this.month.getUTCMonth() + 1, 1, 0, 0, 0));
    
    let start = new Date(this.startDate);

    this.dates = [];
    while (start.getTime() < this.endDate.getTime()) {
      this.dates.push(new Date(start));
      start = new Date(start.getTime() + (24 * 3600000));
    }

    this.daysInMonth = this.dates.length;
    let width = ((27 * this.daysInMonth) + 202) - 2;
    let monthWidth = width - 408;
    this.wkctrStyle = `width: ${width}px;`;
    this.monthStyle = `width: ${monthWidth}px;`;

    this.workcenters = [];
    const site = this.siteService.getSite();
    if (site) { 
      if (site.workcenters && site.workcenters.length > 0) {
        site.workcenters.forEach(wk => {
          if (wk.shifts && wk.shifts.length > 0) {
            this.workcenters.push(new Workcenter(wk));
          }
        });
      }
    }
  }

  getUTCDateSyyle(dt: Date): string {
    if (dt.getUTCDay() === 0 || dt.getUTCDay() === 6) {
      return 'background-color: cyan;color: black;';
    }
    return 'background-color: white;color: black;';
  }

  changeMonth(direction: string, period: string) {
    if (direction.toLowerCase() === 'up') {
      if (period.toLowerCase() === 'month') {
        this.month = new Date(this.month.getUTCFullYear(), 
          this.month.getUTCMonth() + 1, 1);
      } else if (period.toLowerCase() === 'year') {
        this.month = new Date(this.month.getUTCFullYear() + 1, 
        this.month.getUTCMonth(), 1);
      }
    } else {
      if (period.toLowerCase() === 'month') {
        this.month = new Date(this.month.getUTCFullYear(), 
          this.month.getUTCMonth() - 1, 1);
      } else if (period.toLowerCase() === 'year') {
        this.month = new Date(this.month.getUTCFullYear() - 1, 
        this.month.getUTCMonth(), 1);
      }
    }
    this.monthForm.controls["month"].setValue(this.month.getUTCMonth());
    this.monthForm.controls["year"].setValue(this.month.getUTCFullYear());
    this.setMonth();
  }

  selectMonth() {
    let iMonth = Number(this.monthForm.value.month);
    let iYear = Number(this.monthForm.value.year);
    this.month = new Date(iYear, iMonth, 1);
    this.setMonth();
  }
}
