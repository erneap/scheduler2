import { Component } from '@angular/core';
import { SiteScheduleComponent } from './site-schedule.component';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-schedule-mobile',
  templateUrl: './site-schedule.mobile.html',
  styleUrls: ['./site-schedule.mobile.scss']
})
export class SiteScheduleMobile extends SiteScheduleComponent {
  period: number = 7;
  constructor(
    protected ts: TeamService
  ) { 
    super(ts); 
    let tPeriod = 7;
    let width = ((27 * tPeriod) + 144) - 2;
    while (width < window.innerWidth) {
      tPeriod += 7;
      width = ((27 * tPeriod) + 144) - 2;
    }
    this.period = tPeriod - 7;
  }

}
