import { Component } from '@angular/core';
import { Site } from 'src/app/models/sites/site';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { AppStateService } from 'src/app/services/app-state.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-employee-schedule',
  templateUrl: './employee-schedule.component.html',
  styleUrls: ['./employee-schedule.component.scss']
})
export class EmployeeScheduleComponent {
  workcenters: Workcenter[] = []

  constructor(
    protected siteService: SiteService,
    protected stateService: AppStateService
  ) {
    const iSite = this.siteService.getSite();
    if (iSite) {
      const site = new Site(iSite);
      this.workcenters = [];
      if (site.workcenters) {
        site.workcenters.forEach(wc => {
          this.workcenters.push(new Workcenter(wc));
        })
      }
      this.workcenters.sort((a,b) => a.compareTo(b));
    }
  }

  getWidth(): number {
    let ratio = this.stateService.viewWidth / 778; 
    if (ratio > 1.0) {
      ratio = 1.0;
    }
    return Math.floor(714 * ratio);
  }
}
