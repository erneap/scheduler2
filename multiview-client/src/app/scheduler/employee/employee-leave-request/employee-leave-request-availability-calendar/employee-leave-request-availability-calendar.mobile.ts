import { Component } from '@angular/core';
import { EmployeeLeaveRequestAvailabilityCalendarComponent } from './employee-leave-request-availability-calendar.component';

@Component({
  selector: 'app-employee-leave-request-availability-calendar-mobile',
  templateUrl: './employee-leave-request-availability-calendar.mobile.html',
  styleUrls: ['./employee-leave-request-availability-calendar.mobile.scss']
})
export class EmployeeLeaveRequestAvailabilityCalendarMobile 
  extends EmployeeLeaveRequestAvailabilityCalendarComponent {
  constructor() {
    super();
  }
}
