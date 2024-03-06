import { Component } from '@angular/core';
import { EmployeeLeaveRequestCalendarComponent } from './employee-leave-request-calendar.component';

@Component({
  selector: 'app-employee-leave-request-calendar-tablet',
  templateUrl: './employee-leave-request-calendar.tablet.html',
  styleUrls: ['./employee-leave-request-calendar.tablet.scss']
})
export class EmployeeLeaveRequestCalendarTablet extends EmployeeLeaveRequestCalendarComponent {
  constructor() { super() }
}
