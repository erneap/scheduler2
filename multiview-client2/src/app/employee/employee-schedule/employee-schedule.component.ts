import { Component } from '@angular/core';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { AppStateService } from 'src/app/services/app-state.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrls: ['./employee-schedule.component.scss']
})
export class EmployeeScheduleComponent {
  workcenters: Workcenter[] = [];
  constructor(
    protected appState: AppStateService,
    protected siteService: SiteService
  ) {
    this.workcenters = [];
    const site = this.siteService.getSite();
    if (site) {
      site.workcenters.forEach(wc => {
        this.workcenters.push(new Workcenter(wc));
      });
    }
  }
}
