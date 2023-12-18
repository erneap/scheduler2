import { Component, Input } from '@angular/core';
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
  @Input() width: number = 0;
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ts: TeamService
  ) {
    super(es, ss, ts);
  }

  getWidthStyle(column: string): string {
    let width = this.width;
    if (width === 0) {
      width = window.innerWidth;
    }
    if (width > 1000) {
      width = 500;
    } else {
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
        width = Math.floor(width/3);
        break;
      case 'hours':
        width = Math.floor(width * 0.18) - 1;
        break;
      default:
        width = Math.floor(width * 0.18) - 1;
        break;
    }
    return `width: ${width}px;`;
  }
}
