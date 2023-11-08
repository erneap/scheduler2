import { Component } from '@angular/core';
import { EmployeePTOHolidaysPTOComponent } from './employee-ptoholidays-pto.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-employee-ptoholidays-pto-desktop',
  templateUrl: './employee-ptoholidays-pto.desktop.html',
  styleUrls: ['./employee-ptoholidays-pto.desktop.scss']
})
export class EmployeePTOHolidaysPTODesktop extends EmployeePTOHolidaysPTOComponent {
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService
  ) {
    super(es, ss);
  }
}
