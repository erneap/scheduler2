import { Component } from '@angular/core';
import { SiteCoverageDayComponent } from './site-coverage-day.component';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-coverage-day-mobile',
  templateUrl: './site-coverage-day.mobile.html',
  styleUrls: ['./site-coverage-day.mobile.scss']
})
export class SiteCoverageDayMobile extends SiteCoverageDayComponent {
  constructor(
    protected ss: SiteService
  ) { super(ss); }
}
