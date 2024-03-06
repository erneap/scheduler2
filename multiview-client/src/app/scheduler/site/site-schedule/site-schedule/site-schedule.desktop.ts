import { Component } from '@angular/core';
import { SiteScheduleComponent } from './site-schedule.component';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-schedule-desktop',
  templateUrl: './site-schedule.desktop.html',
  styleUrls: ['./site-schedule.desktop.scss']
})
export class SiteScheduleDesktop extends SiteScheduleComponent {
  constructor(
    protected ts: TeamService
  ) { super(ts); }

}
