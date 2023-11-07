import { Component, Input } from '@angular/core';
import { EmployeeScheduleMonth } from './employee-schedule-month';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-schedule-month-tablet',
  templateUrl: './employee-schedule-month.tablet.html',
  styleUrls: ['./employee-schedule-month.tablet.scss']
})
export class EmployeeScheduleMonthTablet extends EmployeeScheduleMonth {
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
