import { Component } from '@angular/core';
import { SiteScheduleRowComponent } from './site-schedule-row.component';

@Component({
  selector: 'app-site-schedule-row-mobile',
  templateUrl: './site-schedule-row.mobile.html',
  styleUrls: ['./site-schedule-row.mobile.scss']
})
export class SiteScheduleRowMobile extends SiteScheduleRowComponent {
  constructor() { super(); }
}
