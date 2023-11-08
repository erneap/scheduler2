import { Component, Input } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeScheduleMonthComponent } from './employee-schedule-month.component';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-schedule-month-tablet',
  templateUrl: './employee-schedule-month.tablet.html',
  styleUrls: ['./employee-schedule-month.tablet.scss']
})
export class EmployeeScheduleMonthTablet extends EmployeeScheduleMonthComponent {

  constructor(
    protected empService: EmployeeService,
    protected ss: SiteService,
    protected ts: TeamService
  ) {
    super(empService, ss, ts);
  }

  getCellStyle(celltype: string): string {
    let iWidth = window.innerWidth;
    if (window.innerHeight < iWidth) {
      iWidth = window.innerHeight;
    }
    let width = Math.floor(iWidth / 7.5) - 1;
    if (celltype.toLowerCase() === 'month') {
      width = (width * 3) + 3;
    }
    return `width: ${width}px;`;
  }
}
