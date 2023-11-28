import { Component, ViewEncapsulation } from '@angular/core';
import { Work } from 'src/app/models/employees/work';
import { Site } from 'src/app/models/sites/site';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { SiteWorkResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-schedule-month2',
  templateUrl: './site-schedule-month2.component.html',
  styleUrls: ['./site-schedule-month2.component.scss'],
})
export class SiteScheduleMonth2Component {
  months: string[] = new Array("January", "Febuary", "March", "April", "May",
  "June", "July", "August", "September", "October", "November", "December");

weekdays: string[] = new Array("Su", "Mo", "Tu", "We", "Th", "Fr", "Sa");

month: Date;
monthLabel: string = '';
daysInMonth: number = 30;
wkctrStyle: string = "width: 1700px;";
monthStyle: string = "width: 1300px;";
workcenters: Workcenter[] = [];
startDate: Date = new Date();
endDate: Date = new Date();
dates: Date[] = [];
expanded: string[] = [];

constructor(
  protected siteService: SiteService,
  protected teamService: TeamService,
  protected dialogService: DialogService,
  protected authService: AuthService
) {
  this.expanded = this.siteService.getExpanded();
  this.month = new Date();
  this.month = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
  this.setMonth();
}

setMonth() {

  this.monthLabel = `${this.months[this.month.getMonth()]} `
    + `${this.month.getFullYear()}`;
  
  // calculate the display's start and end date, where start date is always
  // the sunday before the 1st of the month and end date is the saturday after
  // the end of the month.
  this.startDate = new Date(Date.UTC(this.month.getFullYear(), 
    this.month.getMonth(), 1, 0, 0, 0));
  this.endDate = new Date(Date.UTC(this.month.getFullYear(), 
    this.month.getMonth() + 1, 1, 0, 0, 0));
  
  let start = new Date(this.startDate);

  this.dates = [];
  while (start.getTime() < this.endDate.getTime()) {
    this.dates.push(new Date(start));
    start = new Date(start.getTime() + (24 * 3600000));
  }

  this.daysInMonth = this.dates.length;
  let width = ((27 * this.daysInMonth) + 204) - 2;
  let monthWidth = width - 408;
  this.wkctrStyle = `width: ${width}px;`;
  this.monthStyle = `width: ${monthWidth}px;`;
  const site = this.siteService.getSite();
  if (site) {
    if (!site.hasEmployeeWork(start.getFullYear())) {
      const team = this.teamService.getTeam();
      let teamid = '';
      if (team) { teamid = team.id; }
      this.dialogService.showSpinner();
      this.siteService.retrieveSiteWork(teamid, site.id, start.getFullYear())
      .subscribe({
        next: resp => {
          this.dialogService.closeSpinner();
          if (resp && resp.employees) {
            resp.employees.forEach(remp => {
              if (site.employees) {
                site.employees.forEach(emp => {
                  if (remp.work) {
                    remp.work.forEach(wk => {
                      if (emp.work) {
                        emp.work.push(new Work(wk));
                      }
                    })
                  }
                });
              }
            });
            this.siteService.setSite(site);
          }
          this.setWorkcenters(site);
        },
        error: (err: SiteWorkResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    } else {
      this.setWorkcenters(site);
    }
  }
}

setWorkcenters(site: Site) {
  this.dialogService.showSpinner();
  this.workcenters = [];
  const wkctrMap = new Map<string, number>();
  let addAll = this.expanded.length === 0;
  if (site && site.workcenters && site.workcenters.length > 0) {
    site.workcenters.forEach(wc => {
      this.workcenters.push(new Workcenter(wc));
      if (addAll) {
        this.openPanel(wc.id);
      }
    });
    if (site.employees && site.employees.length > 0) {
      site.employees.forEach(emp => {
        // figure workcenter to include this employee, based on workcenter
        // individual works the most
        wkctrMap.clear();
        let start = new Date(Date.UTC(this.month.getUTCFullYear(), 
          this.month.getUTCMonth(), 1));
        this.dates.forEach(dt => {
          const wd = emp.getWorkdayWOLeaves(site.id, dt);
          if (wd.workcenter !== '') {
            let cnt = wkctrMap.get(wd.workcenter);
            if (cnt) {
              cnt++;
              wkctrMap.set(wd.workcenter, cnt);
            } else {
              cnt = 1;
              wkctrMap.set(wd.workcenter, cnt);
            }
          }
        }); 
        let wkctr = '';
        let count = 0;
        for (let key of wkctrMap.keys()) {
          let cnt = wkctrMap.get(key);
          if (cnt) {
            if (cnt > count) {
              count = cnt;
              wkctr = key;
            }
          }
        }
        if (count === 0) {

        }
        this.workcenters.forEach(wk => {
          if (wk.id.toLowerCase() === wkctr.toLowerCase()) {
            wk.addEmployee(emp, site.showMids, this.month);
          }
        });
      });
    }
  }
  this.dialogService.closeSpinner();
}

openPanel(id: string) {
  let found = false;
  this.expanded.forEach(wk => {
    if (wk.toLowerCase() === id.toLowerCase()) {
      found = true;
    }
  });
  if (!found) {
    this.expanded.push(id);
  }
  this.siteService.setExpanded(this.expanded);
}

closePanel(id: string) {
  let pos = -1;
  for (let i=0; i < this.expanded.length; i++) {
    if (this.expanded[i].toLowerCase() === id.toLowerCase()) {
      pos = i;
    }
  }
  if (pos >= 0) {
    this.expanded.splice(pos, 1);
  }
  this.siteService.setExpanded(this.expanded);
}

isExpanded(id: string): boolean {
  let answer = false;
  this.expanded.forEach(wc => {
    if (wc.toLowerCase() === id.toLowerCase()) {
      answer = true;
    }
  });
  return answer;
}

showShift(shiftID: string): boolean {
  const site = this.siteService.getSite();
  if (site) {
    return ((shiftID.toLowerCase() === 'mids' && site.showMids) 
      || shiftID.toLowerCase() !== 'mids');
  }
  return true;
}

getDateStyle(dt: Date): string {
  if (dt.getUTCDay() === 0 || dt.getUTCDay() === 6) {
    return 'background-color: cyan;color: black;';
  }
  return 'background-color: white;color: black;';
}

changeMonth(direction: string, period: string) {
  if (direction.toLowerCase() === 'up') {
    if (period.toLowerCase() === 'month') {
      this.month = new Date(this.month.getFullYear(), 
        this.month.getMonth() + 1, 1);
    } else if (period.toLowerCase() === 'year') {
      this.month = new Date(this.month.getFullYear() + 1, 
      this.month.getMonth(), 1);
    }
  } else {
    if (period.toLowerCase() === 'month') {
      this.month = new Date(this.month.getFullYear(), 
        this.month.getMonth() - 1, 1);
    } else if (period.toLowerCase() === 'year') {
      this.month = new Date(this.month.getFullYear() - 1, 
      this.month.getMonth(), 1);
    }
  }
  this.setMonth();
}
}
