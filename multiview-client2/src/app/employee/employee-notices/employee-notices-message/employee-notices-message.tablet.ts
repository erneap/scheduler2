import { Component } from '@angular/core';
import { EmployeeNoticesMessageComponent } from './employee-notices-message.component';

@Component({
  selector: 'app-employee-notices-message-tablet',
  templateUrl: './employee-notices-message.tablet.html',
  styleUrls: ['./employee-notices-message.tablet.scss']
})
export class EmployeeNoticesMessageTablet extends EmployeeNoticesMessageComponent {
  constructor() { super(); }
}
