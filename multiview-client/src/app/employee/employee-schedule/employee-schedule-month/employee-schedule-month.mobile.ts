import { Component, Input } from '@angular/core';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { EmployeeService } from 'src/app/services/employee.service';
import { Workcode } from 'src/app/models/teams/workcode';
import { EmployeeScheduleMonthComponent } from './employee-schedule-month.component';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-schedule-month-mobile',
  templateUrl: './employee-schedule-month.mobile.html',
  styleUrls: ['./employee-schedule-month.mobile.scss']
})
export class EmployeeScheduleMonthMobile extends EmployeeScheduleMonthComponent {

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
      iWidth = window.innerHeight - 25;
    }
    let width = Math.floor(iWidth / 7.5) - 1;
    if (celltype.toLowerCase() === 'month') {
      width = (width * 3) + 3;
    }
    return `width: ${width}px;`;
  }
}
