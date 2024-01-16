import { Component, Input } from '@angular/core';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { AppStateService } from 'src/app/services/app-state.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-coverage-period',
  templateUrl: './site-coverage-period.component.html',
  styleUrls: ['./site-coverage-period.component.scss']
})
export class SiteCoveragePeriodComponent {
  private _period: number = 30;
  @Input()
  public set period(days: number) {
    if (days <= 7) {
      this._period = 7;  // weekly
    } else if (days > 28) {
      this._period = 30;
    } else {
      if (days % 7 === 0) {
        this._period = days;
      } else {
        let p = Math.ceil(days / 7);
        this._period = p * 7;
      }
    }
    this.setMonth();
  }
  get period(): number {
    return this._period;
  }
  months: string[] = new Array("January", "Febuary", "March", "April", "May",
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
  lastWorked: Date;

  constructor(
    protected siteService: SiteService,
    protected appState: AppStateService
  ) {
    
    let now = new Date();
    this.month = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 
      now.getDate()));
    this.lastWorked = new Date(0);
    this.setMonth();
  }
  
  setMonth() {
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
    let width = ((27 * this.daysInMonth) + 202) - 2;
    let monthWidth = width - 408;
    if (this.appState.isMobile() || (this.appState.isTablet() 
      && window.innerWidth > window.innerHeight)) {
      monthWidth = width - 148;
    }
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

  getDateSyyle(dt: Date): string {
    if (dt.getUTCDay() === 0 || dt.getUTCDay() === 6) {
      return 'background-color: cyan;color: black;';
    }
    return 'background-color: white;color: black;';
  }

  changeMonth(direction: string, period: string) {
    if (direction.toLowerCase() === 'up') {
      if (period.toLowerCase() === 'month') {
        if (this.period > 28) {
          this.month = new Date(this.month.getFullYear(), 
            this.month.getMonth() + 1, 1);
        } else {
          this.month = new Date(this.month.getTime() 
            + (this.period * (24 * 3600000)));
        }
      } else if (period.toLowerCase() === 'year') {
        this.month = new Date(this.month.getFullYear() + 1, 
        this.month.getMonth(), 1);
      }
    } else {
      if (period.toLowerCase() === 'month') {
        if (this.period > 28) {
          this.month = new Date(this.month.getFullYear(), 
            this.month.getMonth() - 1, 1);
        } else {
          this.month = new Date(this.month.getTime() 
            - (this.period * (24 * 3600000)));
        }
      } else if (period.toLowerCase() === 'year') {
        this.month = new Date(this.month.getFullYear() - 1, 
        this.month.getMonth(), 1);
      }
    }
    this.setMonth();
  }
}
