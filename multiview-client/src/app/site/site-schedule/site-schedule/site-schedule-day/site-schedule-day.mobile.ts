import { Component } from '@angular/core';
import { TeamService } from 'src/app/services/team.service';
import { SiteScheduleDayComponent } from './site-schedule-day.component';

@Component({
  selector: 'app-site-schedule-day-mobile',
  templateUrl: './site-schedule-day.mobile.html',
  styleUrls: ['./site-schedule-day.mobile.scss']
})
export class SiteScheduleDayMobile extends SiteScheduleDayComponent {
  constructor(
    protected ts: TeamService
  ) { super(ts); }
}
