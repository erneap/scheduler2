import { Component } from '@angular/core';
import { EmployeeLeaveRequestCalendarComponent } from './employee-leave-request-calendar.component';

@Component({
  selector: 'app-employee-leave-request-calendar-mobile',
  templateUrl: './employee-leave-request-calendar.mobile.html',
  styleUrls: ['./employee-leave-request-calendar.mobile.scss']
})
export class EmployeeLeaveRequestCalendarMobile  extends EmployeeLeaveRequestCalendarComponent {
  constructor() { super() }
}
