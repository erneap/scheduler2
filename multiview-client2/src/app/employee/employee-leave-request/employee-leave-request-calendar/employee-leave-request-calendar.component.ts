import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ILeaveDay, LeaveDay } from 'src/app/models/employees/leave';
import { Workcode } from 'src/app/models/teams/workcode';
import { LeaveGroup, LeaveMonth } from '../../employee-ptoholidays/employee-ptoholidays.model';

@Component({
  selector: 'app-employee-leave-request-calendar',
  templateUrl: './employee-leave-request-calendar.component.html',
  styleUrls: ['./employee-leave-request-calendar.component.scss']
})
export class EmployeeLeaveRequestCalendarComponent {
  private _startDate: Date = new Date();
  private _endDate: Date = new Date();
  private _leaveDays: LeaveDay[] = [];
  @Input() leaveCodes: Workcode[] = [];
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
  @Input() hours: number = 10;
  @Output() changed = new EventEmitter<string>();

  calendar: LeaveMonth = new LeaveMonth();

  setMonth() {
    this.calendar = new LeaveMonth();
    let start = new Date(Date.UTC(this.startdate.getUTCFullYear(), 
      this.startdate.getUTCMonth(), this.startdate.getUTCDate()));

    while (start.getUTCDay() !== 0) {
      start = new Date(start.getTime() - (24 * 3600000));
    }
    let end = new Date(Date.UTC(this.enddate.getUTCFullYear(), 
      this.enddate.getUTCMonth(), this.enddate.getUTCDate()));
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
        if (day.isDate(lv.leavedate)) {
          day.code = lv.code;
          day.hours = lv.hours;
        }
      });
      week.addLeave(day);
      start = new Date(start.getTime() + (24 * 3600000));
    }
  }

  processChange(value: string) {
    this.changed.emit(value);
  }

  showDay(lv: LeaveDay): boolean {
    //console.log(`lv: ${lv.leavedate} - start: ${this.startdate} - end: ${this.enddate}`);
    const answer = (lv.leavedate.getTime() >= this.startdate.getTime() 
      && lv.leavedate.getTime() <= this.enddate.getTime());
    return answer;
  }

  getDayWidth(): string {
    let width = window.innerWidth - 70;
    width = Math.floor(width / 7);
    return `width: ${width}px;`;
  }
}
