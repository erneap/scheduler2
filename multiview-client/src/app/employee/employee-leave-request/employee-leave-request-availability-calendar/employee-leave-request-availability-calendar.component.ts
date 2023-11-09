import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ILeaveDay, LeaveDay } from 'src/app/models/employees/leave';
import { ISite, Site } from 'src/app/models/sites/site';
import { LeaveGroup, LeaveMonth } from '../../employee-ptoholidays/employee-ptoholidays.model';

@Component({
  selector: 'app-employee-leave-request-availability-calendar',
  templateUrl: './employee-leave-request-availability-calendar.component.html',
  styleUrls: ['./employee-leave-request-availability-calendar.component.scss']
})
export class EmployeeLeaveRequestAvailabilityCalendarComponent {

  private _startDate: Date = new Date();
  private _endDate: Date = new Date();
  private _leaveDays: LeaveDay[] = [];
  private _employee: Employee = new Employee();
  private _site: Site = new Site();
  @Input()
  public set startdate(date: Date) {
    this._startDate = new Date(date);
    this.setMonth();
  }
  get startdate(): Date {
    return this._startDate;
  }
  @Input()
  public set enddate(date: Date) {
    this._endDate = new Date(date);
    this.setMonth();
  }
  get enddate(): Date {
    return this._endDate;
  }
  @Input()
  public set leavedays(days: ILeaveDay[]) {
    this._leaveDays = [];
    days.forEach(day => {
      this._leaveDays.push(new LeaveDay(day));
    });
    this._leaveDays.sort((a,b) => a.compareTo(b));
    this.setMonth();
  }
  get leavedays(): LeaveDay[] {
    return this._leaveDays;
  }
  @Input()
  public set employee(iEmp: IEmployee) {
    this._employee = new Employee(iEmp);
    this.setMonth();
  }
  get employee(): Employee {
    return this._employee;
  }
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
    this.setMonth();
  }
  get site(): Site {
    return this._site;
  }

  calendar: LeaveMonth = new LeaveMonth();

  setMonth() {
    this.calendar = new LeaveMonth();
    let start = new Date(Date.UTC(this.startdate.getUTCFullYear(), this.startdate.getUTCMonth(), this.startdate.getUTCDate()));

    while (start.getUTCDay() !== 0) {
      start = new Date(start.getTime() - (24 * 3600000));
    }
    let end = new Date(Date.UTC(this.enddate.getUTCFullYear(), this.enddate.getUTCMonth(), this.enddate.getUTCDate()));
    end = new Date(end.getTime() + (24 * 3600000));
    while (end.getUTCDay() !== 0) {
      end = new Date(end.getTime() + (24 * 3600000));
    }
    let week: LeaveGroup = new LeaveGroup();
    while (start.getTime() < end.getTime()) {
      if (start.getUTCDay() == 0) {
        week = new LeaveGroup()
        this.calendar.leaveGroups.push(week);
      }
      const day = new LeaveDay();
      day.leavedate = start;
      this._leaveDays.forEach(lv => {
        if (day.leavedate.getFullYear() === lv.leavedate.getFullYear()
          && day.leavedate.getMonth() === lv.leavedate.getMonth()
          && day.leavedate.getDate() === lv.leavedate.getDate()) {
          day.code = lv.code;
          day.hours = lv.hours;
        }
      });
      week.addLeave(day);
      start = new Date(start.getTime() + (24 * 3600000));
    }
  }

  showDay(lv: LeaveDay): boolean {
    return (lv.leavedate.getTime() >= this.startdate.getTime() 
      && lv.leavedate.getTime() <= this.enddate.getTime());
  }
}
