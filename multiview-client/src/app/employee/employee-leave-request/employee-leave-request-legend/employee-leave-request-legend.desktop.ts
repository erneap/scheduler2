import { Component } from '@angular/core';
import { EmployeeLeaveRequestLegendComponent } from './employee-leave-request-legend.component';

@Component({
  selector: 'app-employee-leave-request-legend-desktop',
  templateUrl: './employee-leave-request-legend.desktop.html',
  styleUrls: ['./employee-leave-request-legend.desktop.scss']
})
export class EmployeeLeaveRequestLegendDesktop extends EmployeeLeaveRequestLegendComponent {
  constructor() { super() }
}
