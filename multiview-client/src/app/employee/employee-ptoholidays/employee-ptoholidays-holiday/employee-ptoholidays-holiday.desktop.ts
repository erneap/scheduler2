import { Component } from '@angular/core';
import { EmployeePTOHolidaysHolidayComponent } from './employee-ptoholidays-holiday.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-ptoholidays-holiday-desktop',
  templateUrl: './employee-ptoholidays-holiday.desktop.html',
  styleUrls: ['./employee-ptoholidays-holiday.desktop.scss']
})
export class EmployeePTOHolidaysHolidayDesktop extends EmployeePTOHolidaysHolidayComponent {
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ts: TeamService
  ) {
    super(es, ss, ts);
  }
}
