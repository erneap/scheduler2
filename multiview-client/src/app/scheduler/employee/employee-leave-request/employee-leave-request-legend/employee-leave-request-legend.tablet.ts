import { Component } from '@angular/core';
import { EmployeeLeaveRequestLegendComponent } from './employee-leave-request-legend.component';

@Component({
  selector: 'app-employee-leave-request-legend-tablet',
  templateUrl: './employee-leave-request-legend.tablet.html',
  styleUrls: ['./employee-leave-request-legend.tablet.scss']
})
export class EmployeeLeaveRequestLegendTablet extends EmployeeLeaveRequestLegendComponent {
  constructor() { super() }
}
