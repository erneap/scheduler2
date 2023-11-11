import { Component } from '@angular/core';
import { SiteCoverageComponent } from './site-coverage.component';

@Component({
  selector: 'app-site-coverage-mobile',
  templateUrl: './site-coverage.mobile.html',
  styleUrls: ['./site-coverage.mobile.scss']
})
export class SiteCoverageMobile extends SiteCoverageComponent {
  period: number = 7;
  constructor() {
    super();
    let tPeriod = 7;
    let width = ((27 * tPeriod) + 144) - 2;
    while (width < window.innerWidth) {
      tPeriod += 7;
      width = ((27 * tPeriod) + 144) - 2;
    }
    this.period = tPeriod - 7;
  }
}
