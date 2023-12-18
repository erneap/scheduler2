import { Component } from '@angular/core';
import { EmployeePTOHolidaysHolidayComponent } from './employee-ptoholidays-holiday.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-ptoholidays-holiday-tablet',
  templateUrl: './employee-ptoholidays-holiday.tablet.html',
  styleUrls: ['./employee-ptoholidays-holiday.tablet.scss']
})
export class EmployeePTOHolidaysHolidayTablet extends EmployeePTOHolidaysHolidayComponent {
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ts: TeamService
  ) {
    super(es, ss, ts);
  }

  getWidthStyle(column: string): string {
    let width = window.innerWidth;
    if (window.innerHeight < window.innerWidth) {
      width = Math.floor(width/2);
    }
    switch (column.toLowerCase()) {
      case 'title':
        width = width - 2;
        break;
      case 'dates':
        width = Math.floor(width * 0.52) - 1;
        break;
      case 'code':
        width = Math.floor(width * 0.12) - 1;
        break;
      case 'bottom':
        width = Math.floor(width * 0.33) - 1;
        break;
      default:
        width = Math.floor(width * 0.18) - 1;
        break;
    }
    return `width: ${width}px;`;
  }
}
