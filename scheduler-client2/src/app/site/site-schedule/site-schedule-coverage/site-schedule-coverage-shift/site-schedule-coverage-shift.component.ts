import { Component, Input } from '@angular/core';
import { ISite, Site } from 'src/app/models/sites/site';
import { Shift } from 'src/app/models/sites/workcenter';

@Component({
  selector: 'app-site-schedule-coverage-shift',
  templateUrl: './site-schedule-coverage-shift.component.html',
  styleUrls: ['./site-schedule-coverage-shift.component.scss']
})
export class SiteScheduleCoverageShiftComponent {
  private _site: Site = new Site();
  @Input()
  public set site(s: ISite) {
    this._site = new Site(s);
  }
  get site(): Site {
    return this._site;
  }
  private _dates: Date[] = [];
  @Input()
  public set dates(dt: Date[]) {
    this._dates = [];
    dt.forEach(d => {
      this._dates.push(new Date(d));
    })
  }
  get dates(): Date[] {
    return this._dates
  }
  @Input() wkctrID: string = '';
  @Input() shift: Shift = new Shift();
  @Input() viewtype: string = 'label';
  @Input() width: number = 25;
}
