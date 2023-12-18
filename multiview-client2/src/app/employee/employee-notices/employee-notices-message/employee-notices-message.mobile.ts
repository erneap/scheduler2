import { Component } from '@angular/core';
import { EmployeeNoticesMessageComponent } from './employee-notices-message.component';

@Component({
  selector: 'app-employee-notices-message-mobile',
  templateUrl: './employee-notices-message.mobile.html',
  styleUrls: ['./employee-notices-message.mobile.scss']
})
export class EmployeeNoticesMessageMobile extends EmployeeNoticesMessageComponent {
  constructor() { super(); }
}
