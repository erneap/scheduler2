import { Component } from '@angular/core';
import { EmployeeNoticesMessageComponent } from './employee-notices-message.component';

@Component({
  selector: 'app-employee-notices-message-desktop',
  templateUrl: './employee-notices-message.desktop.html',
  styleUrls: ['./employee-notices-message.desktop.scss']
})
export class EmployeeNoticesMessageDesktop extends EmployeeNoticesMessageComponent {
  constructor() { super(); }
}
