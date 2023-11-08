import { Component, Input } from '@angular/core';
import { EmployeeScheduleDayComponent } from './employee-schedule-day.component';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-schedule-day-desktop',
  templateUrl: './employee-schedule-day.desktop.html',
  styleUrls: ['./employee-schedule-day.desktop.scss']
})
export class EmployeeScheduleDayDesktop extends EmployeeScheduleDayComponent {

  constructor(
    protected tm: TeamService
  ) {
    super(tm);
  }
}
