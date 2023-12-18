import { Component, Input } from '@angular/core';
import { Workday } from 'src/app/models/employees/assignments';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { Workcode } from 'src/app/models/teams/workcode';
import { EmployeeService } from 'src/app/services/employee.service';
import { WorkWeek } from '../employee-schedule.model';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { EmployeeWorkResponse } from 'src/app/models/web/employeeWeb';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { Work } from 'src/app/models/employees/work';
import { Employee } from 'src/app/models/employees/employee';

@Component({
  selector: 'app-employee-schedule-month',
  templateUrl: './employee-schedule-month.component.html',
  styleUrls: ['./employee-schedule-month.component.scss']
})
export class EmployeeScheduleMonthComponent {
  public workcenters: Workcenter[] = [];
  public workcodes: Workcode[] = [];
  months: string[] = new Array("January", "Febuary", "March", "April", "May",
    "June", "July", "August", "September", "October", "November", "December");

  weekdays: string[] = new Array("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat");

  month: Date = new Date();
  startDate: Date = new Date();
  endDate: Date = new Date();

  workweeks: WorkWeek[] = [];
  monthLabel: string = "";

  constructor(
    protected employeeService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService
  ) {
    this.workcodes = [];
    const team = this.teamService.getTeam();
    if (team) {
      team.workcodes.forEach(wc => {
        this.workcodes.push(new Workcode(wc));
      });
    }
    this.workcenters = [];
    const site = this.siteService.getSite();
    if (site) {
      site.workcenters.forEach(wc => {
        this.workcenters.push(new Workcenter(wc));
      });
    }
    this.month = new Date();
    this.month = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
    this.setMonth();
  }

  setMonth() {
    this.monthLabel = `${this.months[this.month.getMonth()]} `
      + `${this.month.getFullYear()}`;
      this.workweeks = [];
    
    // calculate the display's start and end date, where start date is always
    // the sunday before the 1st of the month and end date is the saturday after
    // the end of the month.
    this.startDate = new Date(Date.UTC(this.month.getFullYear(), 
      this.month.getMonth(), 1, 0, 0, 0));
    while (this.startDate.getUTCDay() !== 0) {
      this.startDate = new Date(this.startDate.getTime() - (24 * 3600000));
    }
    this.endDate = new Date(Date.UTC(this.month.getFullYear(), 
      this.month.getMonth() + 1, 1, 0, 0, 0));
    while (this.endDate.getUTCDay() !== 0) {
      this.endDate = new Date(this.endDate.getTime() + (24 * 3600000));
    }
    
    const emp = this.employeeService.getEmployee();
    if (emp) {
      if (!emp.hasWorkForYear(this.startDate.getFullYear())) {
        this.dialogService.showSpinner();
        this.employeeService.retrieveEmployeeWork(emp.id, 
          this.startDate.getFullYear()).subscribe({
          next: resp => {
            this.dialogService.closeSpinner();
            if (resp && resp.id !== '') {
              if (emp.id === resp.id && resp.work) {
                resp.work.forEach(wk => {
                  emp.addWork(wk)
                });
                this.employeeService.replaceEmployee(emp);
              }
            }
            this.setWorkweeks(emp);
          },
          error: (err: EmployeeWorkResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
            this.setWorkweeks(emp);
          }
        });
      } else {
        this.setWorkweeks(emp);
      }
    }
  }

  setWorkweeks(emp: Employee) {
    let count = -1;
    let start = new Date(this.startDate);
    var workweek: WorkWeek | undefined;
    while (start.getTime() < this.endDate.getTime()) {
      if (!workweek || start.getUTCDay() === 0) {
        count++;
        workweek = new WorkWeek(count);
        this.workweeks.push(workweek);
      }
      if (emp) {
        let wd = emp.getWorkday(emp.site, start);
        if (!wd) {
          wd = new Workday();
          wd.id = start.getUTCDay();
        } else if (wd.id === 0) {
          wd.id = start.getUTCDay();
        }
        wd.date = new Date(start.getTime());
        workweek.setWorkday(wd, start);
      } else {
        const wd = new Workday();
        workweek.setWorkday(wd, start);
      }
      start = new Date(start.getTime() + (24 * 3600000));
    }
    this.workweeks.sort((a,b) => a.compareTo(b));
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
