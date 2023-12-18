import { Component } from '@angular/core';
import { EmployeeContactInfoComponent } from './employee-contact-info.component';
import { TeamService } from 'src/app/services/team.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-contact-info',
  templateUrl: './employee-contact-info.tablet.html',
  styleUrls: ['./employee-contact-info.tablet.scss']
})
export class EmployeeContactInfoTablet
  extends EmployeeContactInfoComponent {
  constructor(
    protected ts: TeamService,
    protected es: EmployeeService
  ) {
    super(ts, es);
  }
}
