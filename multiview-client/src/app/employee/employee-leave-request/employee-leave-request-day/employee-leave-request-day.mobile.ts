import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { EmployeeLeaveRequestDayComponent } from './employee-leave-request-day.component';

@Component({
  selector: 'app-employee-leave-request-day-mobile',
  templateUrl: './employee-leave-request-day.mobile.html',
  styleUrls: ['./employee-leave-request-day.mobile.scss']
})
export class EmployeeLeaveRequestDayMobile extends EmployeeLeaveRequestDayComponent {
  constructor(
    private f: FormBuilder,
  ) {
    super(f)
  }
}
