import { Component } from '@angular/core';
import { SiteMidScheduleYearComponent } from './site-mid-schedule-year.component';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-mid-schedule-year-mobile',
  templateUrl: './site-mid-schedule-year.mobile.html',
  styleUrls: ['./site-mid-schedule-year.mobile.scss']
})
export class SiteMidScheduleYearMobile extends SiteMidScheduleYearComponent {
  constructor(
    protected ss: SiteService
  ) { 
    super(ss);
  }
}
