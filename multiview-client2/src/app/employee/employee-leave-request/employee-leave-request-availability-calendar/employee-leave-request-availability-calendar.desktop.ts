import { Component } from '@angular/core';
import { EmployeeLeaveRequestAvailabilityCalendarComponent } from './employee-leave-request-availability-calendar.component';

@Component({
  selector: 'app-employee-leave-request-availability-calendar-desktop',
  templateUrl: './employee-leave-request-availability-calendar.desktop.html',
  styleUrls: ['./employee-leave-request-availability-calendar.desktop.scss']
})
export class EmployeeLeaveRequestAvailabilityCalendarDesktop 
  extends EmployeeLeaveRequestAvailabilityCalendarComponent {
  constructor() {
    super();
  }
}
