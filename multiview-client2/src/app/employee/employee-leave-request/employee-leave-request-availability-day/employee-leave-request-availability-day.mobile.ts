import { Component } from '@angular/core';
import { EmployeeLeaveRequestAvailabilityDayComponent } from './employee-leave-request-availability-day.component';

@Component({
  selector: 'app-employee-leave-request-availability-day-mobile',
  templateUrl: './employee-leave-request-availability-day.mobile.html',
  styleUrls: ['./employee-leave-request-availability-day.mobile.scss']
})
export class EmployeeLeaveRequestAvailabilityDayMobile 
  extends EmployeeLeaveRequestAvailabilityDayComponent {
  constructor() { super(); }
}
