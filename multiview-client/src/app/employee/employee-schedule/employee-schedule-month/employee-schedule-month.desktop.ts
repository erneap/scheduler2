import { Component, Input } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { EmployeeScheduleMonthComponent } from './employee-schedule-month.component';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employee-schedule-month-desktop',
  templateUrl: './employee-schedule-month.desktop.html',
  styleUrls: ['./employee-schedule-month.desktop.scss']
})
export class EmployeeScheduleMonthDesktop extends EmployeeScheduleMonthComponent {

  constructor(
    protected empService: EmployeeService,
    protected ss: SiteService,
    protected ts: TeamService,
    protected ds: DialogService,
    protected as: AuthService
  ) {
    super(empService, ss, ts, ds, as);
  }
}
