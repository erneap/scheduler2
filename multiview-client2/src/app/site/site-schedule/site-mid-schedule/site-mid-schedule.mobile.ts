import { Component } from '@angular/core';
import { SiteMidScheduleComponent } from './site-mid-schedule.component';

@Component({
  selector: 'app-site-mid-schedule-mobile',
  templateUrl: './site-mid-schedule.mobile.html',
  styleUrls: ['./site-mid-schedule.mobile.scss']
})
export class SiteMidScheduleMobile extends SiteMidScheduleComponent {
  constructor( ) { 
    super();
  }
}
