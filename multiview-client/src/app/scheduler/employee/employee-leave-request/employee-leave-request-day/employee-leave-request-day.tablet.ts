import { Component } from '@angular/core';
import { EmployeeLeaveRequestDayComponent } from './employee-leave-request-day.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employee-leave-request-day-tablet',
  templateUrl: './employee-leave-request-day.tablet.html',
  styleUrls: ['./employee-leave-request-day.tablet.scss']
})
export class EmployeeLeaveRequestDayTablet  extends EmployeeLeaveRequestDayComponent {
  constructor(
    private f: FormBuilder,
  ) {
    super(f)
  }
}
