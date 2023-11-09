import { Component } from '@angular/core';
import { EmployeeLeaveRequestAvailabilityDayComponent } from './employee-leave-request-availability-day.component';

@Component({
  selector: 'app-employee-leave-request-availability-day-desktop',
  templateUrl: './employee-leave-request-availability-day.desktop.html',
  styleUrls: ['./employee-leave-request-availability-day.desktop.scss']
})
export class EmployeeLeaveRequestAvailabilityDayDesktop 
  extends EmployeeLeaveRequestAvailabilityDayComponent {
  constructor() {
    super();
  }
}
