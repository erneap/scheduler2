import { Component, Input } from '@angular/core';
import { Workday } from 'src/app/models/employees/assignments';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { WorkWeek } from 'src/app/models/web/internalWeb';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-schedule-month',
  templateUrl: './employee-schedule-month.component.html',
  styleUrls: ['./employee-schedule-month.component.scss']
})
export class EmployeeScheduleMonthComponent {
  @Input() workcenters: Workcenter[] = [];
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
  ) {
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
      this.month.getMonth(), 1));
    while (this.startDate.getDay() !== 0) {
      this.startDate = new Date(this.startDate.getTime() - (24 * 3600000));
    }
    this.endDate = new Date(Date.UTC(this.month.getFullYear(), 
      this.month.getMonth() + 1, 1));
    this.endDate = new Date(this.endDate.getTime() - 1000);
    while (this.endDate.getDay() !== 0) {
      this.endDate = new Date(this.endDate.getTime() + (24 * 3600000));
    }

    let count = -1;
    let start = new Date(this.startDate);
    const emp = this.employeeService.getEmployee();
    var workweek: WorkWeek | undefined;
    while (start.getTime() < this.endDate.getTime()) {
      if (!workweek || start.getDay() === 0) {
        count++;
        workweek = new WorkWeek(count);
        this.workweeks.push(workweek);
      }
      if (emp) {
        let wd = emp.data.getWorkday(emp.site, start);
        if (!wd) {
          wd = new Workday();
          wd.date = new Date(start);
        } else if (wd.id === 0) {
          wd.id = start.getDay();
        }
        workweek.setWorkday(wd, start)
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
