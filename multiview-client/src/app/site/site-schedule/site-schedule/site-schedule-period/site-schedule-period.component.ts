import { Component, Input } from '@angular/core';
import { Work } from 'src/app/models/employees/work';
import { Site } from 'src/app/models/sites/site';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { SiteWorkResponse } from 'src/app/models/web/siteWeb';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-schedule-period',
  templateUrl: './site-schedule-period.component.html',
  styleUrls: ['./site-schedule-period.component.scss']
})
export class SiteSchedulePeriodComponent {
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
  directionStyle: string = 'width: 100px;';
  wkctrStyle: string = "width: 1700px;";
  monthStyle: string = "width: 1300px;";
  nameStyle: string = "width: 200px;"
  workcenters: Workcenter[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  dates: Date[] = [];
  expanded: string[] = [];
  rowIncrement: number = 0;

  constructor(
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    protected appState: AppStateService
  ) {
    this.expanded = this.siteService.getExpanded();
    if (this.expanded.length === 0 && appState.isDesktop()) {
      const site = this.siteService.getSite();
      if (site) {
        site.workcenters.forEach(wk => {
          this.expanded.push(wk.id);
        });
      }
    }
    let now = new Date();
    this.month = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 
      now.getDate()));
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
    let width = ((27 * this.daysInMonth) + 244) - 2;
    let monthWidth = width - 408;
    if (this.appState.isMobile() || (this.appState.isTablet() 
      && window.innerWidth > window.innerHeight)) {
      this.directionStyle = 'width: 35px;';
      monthWidth = width - 148;
    }
    if (this.appState.isMobile()) {
      this.nameStyle = 'width: 100px;'
    }
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

  increment(wkctr: string, field: string, i: number, j: number): number {
    let count = 0;
    this.workcenters.forEach(wc => {
      if (wc.id === wkctr) {
        if (field.toLowerCase() === 'position') {
          if (wc.positions) {
            for (let p=0; p < i; p++) {
              const position = wc.positions[p];
              if (position.employees) {
                count += position.employees.length;
              }
            }
            count += j
          }
        } else if (field.toLowerCase() === 'shift') {
          if (wc.positions) {
            wc.positions.forEach(pos => {
              if (pos.employees) {
                count += pos.employees.length;
              }
            });
          }
          if (wc.shifts) {
            for (let s=0; s < i; s++) {
              const shift = wc.shifts[s];
              if (shift.employees) {
                count += shift.employees.length;
              }
            }
          }
          count += j;
        } else {
          if (wc.positions) {
            wc.positions.forEach(pos => {
              if (pos.employees) {
                count += pos.employees.length;
              }
            });
          }
          if (wc.shifts) {
            wc.shifts.forEach(sft => {
              if (sft.employees) {
                count += sft.employees.length;
              }
            })
          }
          count += j;
        }  
      }
    });
    return count;
  }
}
