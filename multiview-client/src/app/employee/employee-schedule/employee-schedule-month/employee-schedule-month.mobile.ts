import { Component, Input } from '@angular/core';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { EmployeeScheduleMonth } from './employee-schedule-month';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-schedule-month-mobile',
  templateUrl: './employee-schedule-month.mobile.html',
  styleUrls: ['./employee-schedule-month.mobile.scss']
})
export class EmployeeScheduleMonthMobile extends EmployeeScheduleMonth {
  @Input() 
  public set workcenters(wkctrs: Workcenter[]) {
    this.setWorkcenters(wkctrs);
  }
  get workcenters(): Workcenter[] {
    return this.getWorkcenters();
  }

  constructor(
    protected empService: EmployeeService
  ) {
    super(empService);
  }
}
