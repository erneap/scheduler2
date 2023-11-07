import { Component, Input } from '@angular/core';
import { EmployeeScheduleDay } from './employee-schedule-day';
import { Workday } from 'src/app/models/employees/assignments';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-schedule-day-desktop',
  templateUrl: './employee-schedule-day.desktop.html',
  styleUrls: ['./employee-schedule-day.desktop.scss']
})
export class EmployeeScheduleDayDesktop extends EmployeeScheduleDay {
  @Input() 
  public override set workday(wd: Workday) {
    super.workday = wd;
  }
  override get workday(): Workday {
    return super.workday;
  }
  @Input() 
  public override set month(date: Date) {
    super.month = date;
  }
  override get month(): Date {
    return super.month;
  }
  @Input()
  public override set workcenters(wks: Workcenter[]) {
    super.workcenters = wks;
  }
  override get workcenters(): Workcenter[] {
    return super.workcenters;
  }

  constructor(
    protected ts: TeamService
  ) {
    super(ts);
  }
}
