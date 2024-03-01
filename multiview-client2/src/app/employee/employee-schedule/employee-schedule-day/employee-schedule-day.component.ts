import { Component, Input } from '@angular/core';
import { Workday } from '../../../models/employees/assignments';
import { Workcenter } from '../../../models/sites/workcenter';

@Component({
  selector: 'app-employee-schedule-day',
  standalone: true,
  imports: [],
  templateUrl: './employee-schedule-day.component.html',
  styleUrl: './employee-schedule-day.component.scss'
})
export class EmployeeScheduleDayComponent {
  private _workday: Workday = new Workday();
  private _month: Date = new Date();
  @Input() 
  public set workday(wd: Workday) {
    if (!wd) {
      wd = new Workday();
    }
    this._workday = wd;
  }
  get workday(): Workday {
    return this._workday;
  }
  @Input() 
  public set month(date: Date) {
    this._month = new Date(date);
  }
  get month(): Date {
    return this._month;
  }
  @Input() workcenters: Workcenter[] = [];
}
