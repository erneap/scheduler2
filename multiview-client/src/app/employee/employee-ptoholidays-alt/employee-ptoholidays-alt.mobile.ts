import { Component } from '@angular/core';
import { EmployeePtoholidaysAltComponent } from './employee-ptoholidays-alt.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-ptoholidays-alt-mobile',
  templateUrl: './employee-ptoholidays-alt.mobile.html',
  styleUrls: ['./employee-ptoholidays-alt.mobile.scss']
})
export class EmployeePtoholidaysAltMobile 
  extends EmployeePtoholidaysAltComponent {
    constructor(
      protected es: EmployeeService,
      protected ts: TeamService
    ) {
      super(es, ts);
    }
}
