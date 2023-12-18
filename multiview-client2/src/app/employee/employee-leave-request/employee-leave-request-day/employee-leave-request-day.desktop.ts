import { Component } from '@angular/core';
import { EmployeeLeaveRequestDayComponent } from './employee-leave-request-day.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employee-leave-request-day-desktop',
  templateUrl: './employee-leave-request-day.desktop.html',
  styleUrls: ['./employee-leave-request-day.desktop.scss']
})
export class EmployeeLeaveRequestDayDesktop extends EmployeeLeaveRequestDayComponent {
  constructor(
    private f: FormBuilder,
  ) {
    super(f)
  }
}
