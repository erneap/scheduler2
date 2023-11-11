import { Component } from '@angular/core';
import { SiteSchedulePeriodComponent } from './site-schedule-period.component';
import { SiteService } from 'src/app/services/site.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-site-schedule-period-mobile',
  templateUrl: './site-schedule-period.mobile.html',
  styleUrls: ['./site-schedule-period.mobile.scss']
})
export class SiteSchedulePeriodMobile extends SiteSchedulePeriodComponent {
  constructor(
    protected ss: SiteService,
    protected ds: DialogService,
    protected as: AppStateService
  ) { super(ss, ds, as); }

  override setMonth() {
    this.monthLabel = `${this.months[this.month.getMonth()]} `
      + `${this.month.getFullYear()}`;
    
    // calculate the display's start and end date, where start date is always
    // the sunday before the 1st of the month and end date is the saturday after
    // the end of the month.
    if (this.period > 28) {
      this.startDate = new Date(Date.UTC(this.month.getFullYear(), 
        this.month.getMonth(), 1, 0, 0, 0));
      this.endDate = new Date(Date.UTC(this.month.getFullYear(), 
        this.month.getMonth() + 1, 1, 0, 0, 0));
    } else {
      this.startDate = new Date(Date.UTC(this.month.getFullYear(), 
        this.month.getMonth(), this.month.getDate(), 0, 0, 0, 0));
      while (this.startDate.getDay() !== 0) {
        this.startDate = new Date(this.startDate.getTime() - (24 * 3600000));
      }
      this.endDate = new Date(this.startDate.getTime() + (this.period 
        * (24 * 3600000)));
    }
    
    let start = new Date(this.startDate);

    this.dates = [];
    while (start.getTime() < this.endDate.getTime()) {
      this.dates.push(new Date(start));
      start = new Date(start.getTime() + (24 * 3600000));
    }

    this.daysInMonth = this.dates.length;
    let width = ((22 * this.daysInMonth) + 144) - 2;
    let monthWidth = width - 148;
    this.wkctrStyle = `width: ${width}px;`;
    this.monthStyle = `width: ${monthWidth}px;`;
    this.directionStyle = 'width: 35px;';

    this.setWorkcenters();
  }
}
