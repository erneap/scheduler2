import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ILeaveDay, LeaveDay } from 'src/app/models/employees/leave';
import { ISite, Site } from 'src/app/models/sites/site';

@Component({
  selector: 'app-employee-leave-request-availability-day',
  templateUrl: './employee-leave-request-availability-day.component.html',
  styleUrls: ['./employee-leave-request-availability-day.component.scss']
})
export class EmployeeLeaveRequestAvailabilityDayComponent {
  private _show: boolean = true;
  private _leaveday: LeaveDay = new LeaveDay();
  private _employee: Employee = new Employee();
  private _site: Site = new Site();
  @Input()
  public set showdate(show: boolean) {
    this._show = show;
    this.displayClass = this.coverage();
  }
  get showdate(): boolean {
    return this._show;
  }
  @Input()
  public set leaveday(lday: ILeaveDay) {
    this._leaveday = new LeaveDay(lday);
    this.displayClass = this.coverage();
  }
  get leaveday(): LeaveDay {
    return this._leaveday;
  }
  @Input()
  public set employee(iEmp: IEmployee) {
    this._employee = new Employee(iEmp);
    this.displayClass = this.coverage();
  }
  get employee(): Employee {
    return this._employee;
  }
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
    this.displayClass = this.coverage();
  }
  get site(): Site {
    return this._site;
  }
  displaySize: number = 0;
  displayClass: string = "cell";

  constructor() {}

  coverage(): string {
    if (this.employee.id === '' || this.site.id === '') {
      return "cell disabled";
    }
    if (!this.showdate) {
      return "cell disabled";
    }
    // determine the shift/workcenter the employee would be working on the date
    let wd = this.employee.getWorkdayWOLeaves(this.site.id, 
      this.leaveday.leavedate);
    if (!wd || wd.code === '') {
      for (let i = 1; i < 8 && (!wd || wd.code === ''); i++) {
        let newdate = new Date(Date.UTC(this.leaveday.leavedate.getFullYear(),
          this.leaveday.leavedate.getMonth(), 
          this.leaveday.leavedate.getDate() - i));
        wd = this.employee.getWorkdayWOLeaves(this.site.id, newdate);
      }
    }

    // count the number of employees
    const wkctr = wd.workcenter;
    let coverage: number = 0;
    let codes: string[] = [];
    this.site.workcenters.forEach(wk => {
      if (wk.id === wkctr) {
        if (wk.shifts) {
          wk.shifts.forEach(s => {
            if (s.associatedCodes) {
              let found = false;
              s.associatedCodes.forEach(cd => {
                if (cd.toLowerCase() === wd.code.toLowerCase()) {
                  found = true;
                }
              });
              if (found) {
                s.associatedCodes.forEach(cd => {
                  codes.push(cd);
                });
                coverage = s.minimums;
              }
            }
          });
        }
      }
    });
    this.displaySize = 0;
    if (this.site.employees) {
      this.site.employees.forEach(emp => {
        wd = emp.getWorkday(this.site.id, this.leaveday.leavedate);
        codes.forEach(cd => {
          if (wd.workcenter === wkctr && cd.toLowerCase() === wd.code.toLowerCase()) {
            this.displaySize++;
          }
        });
      });
    }
    wd = this.employee.getWorkday(this.site.id, this.leaveday.leavedate);
    codes.forEach(cd => {
      if (wd.workcenter === wkctr && cd.toLowerCase() === wd.code.toLowerCase()) {
        this.displaySize--;
      }
    })
    if (this.displaySize < coverage) {
      return "cell below";
    }
    return "cell above";
  }
}
