import { Component } from '@angular/core';
import { EmployeeLeaveRequestLegendComponent } from './employee-leave-request-legend.component';

@Component({
  selector: 'app-employee-leave-request-legend-mobile',
  templateUrl: './employee-leave-request-legend.mobile.html',
  styleUrls: ['./employee-leave-request-legend.mobile.scss']
})
export class EmployeeLeaveRequestLegendMobile extends EmployeeLeaveRequestLegendComponent {
  constructor() { super() }
}
