import { Component } from '@angular/core';
import { EmployeeContactInfoComponent } from './employee-contact-info.component';
import { TeamService } from 'src/app/services/team.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-contact-info-mobile',
  templateUrl: './employee-contact-info.mobile.html',
  styleUrls: ['./employee-contact-info.mobile.scss']
})
export class EmployeeContactInfoMobile 
  extends EmployeeContactInfoComponent {
  constructor(
    protected ts: TeamService,
    protected es: EmployeeService
  ) {
    super(ts, es);
  }
}
