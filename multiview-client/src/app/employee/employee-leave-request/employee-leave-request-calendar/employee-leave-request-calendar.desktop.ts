import { Component } from '@angular/core';
import { EmployeeLeaveRequestCalendarComponent } from './employee-leave-request-calendar.component';

@Component({
  selector: 'app-employee-leave-request-calendar-desktop',
  templateUrl: './employee-leave-request-calendar.desktop.html',
  styleUrls: ['./employee-leave-request-calendar.desktop.scss']
})
export class EmployeeLeaveRequestCalendarDesktop extends EmployeeLeaveRequestCalendarComponent {
  constructor() { super() }
}
