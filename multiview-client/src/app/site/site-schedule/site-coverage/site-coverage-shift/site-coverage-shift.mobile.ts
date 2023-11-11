import { Component } from '@angular/core';
import { SiteCoverageShiftComponent } from './site-coverage-shift.component';

@Component({
  selector: 'app-site-coverage-shift-mobile',
  templateUrl: './site-coverage-shift.mobile.html',
  styleUrls: ['./site-coverage-shift.mobile.scss']
})
export class SiteCoverageShiftMobile extends SiteCoverageShiftComponent {
  constructor() { super(); }
}
