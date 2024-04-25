import { Component, Input } from '@angular/core';
import { Work } from 'src/app/models/employees/work';
import { ISite, Site } from 'src/app/models/sites/site';
import { Shift } from 'src/app/models/sites/workcenter';

@Component({
  selector: 'app-site-schedule-coverage-day',
  templateUrl: './site-schedule-coverage-day.component.html',
  styleUrls: ['./site-schedule-coverage-day.component.scss']
})
export class SiteScheduleCoverageDayComponent {
  private _site: Site = new Site();
  @Input()
  public set site(s: ISite) {
    this._site = new Site(s);
  }
  get site(): Site {
    return this._site;
  }
  private _date: Date = new Date();
  @Input()
  public set date(dt: Date) {
    this._date = new Date(dt);
  }
  get date(): Date {
    return this._date;
  }
  @Input() wkctrID: string = '';
  @Input() shiftID: string = '';
  @Input() width: number = 25;
  @Input() viewtype: string = 'label';

  cellStyle: string = 'cell';

  getCoverage(): number {
    // determine the shift requirements from the site 
    let count = 0;
    let shift: Shift = new Shift();
    this.site.workcenters.forEach(wc => {
      if (wc.id.toLowerCase() === this.wkctrID.toLowerCase()) {
        if (wc.shifts && wc.shifts.length > 0) {
          wc.shifts.forEach(shft => {
            if (shft.id.toLowerCase() === this.shiftID.toLowerCase()) {
              shift = new Shift(shft);
            }
          });
        }
      }
    });
    if (this.site.employees && this.site.employees.length > 0) {
      this.site.employees.forEach(emp => {
        let work = new Work();
        if (emp.work && emp.work.length > 0) {
          emp.work.sort((a,b) => a.compareTo(b));
          work = emp.work[emp.work.length - 1];
        }
        const wd = emp.getWorkday(this.site.id, this.date, work.dateWorked);
        if (shift.associatedCodes && shift.associatedCodes.length > 0) {
          shift.associatedCodes.forEach(ac => {
            if (ac.toLowerCase() === wd.code.toLowerCase()) {
              count++;
            }
          });
        }
      });
    }
    if (count < shift.minimums) {
      this.cellStyle = "cell under";
    }
    return count;
  }
}
