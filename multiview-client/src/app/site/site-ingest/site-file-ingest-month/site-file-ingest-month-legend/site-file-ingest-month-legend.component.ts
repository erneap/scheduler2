import { Component, Input } from '@angular/core';
import { IWorkcode, Workcode } from 'src/app/models/teams/workcode';

@Component({
  selector: 'app-site-file-ingest-month-legend',
  templateUrl: './site-file-ingest-month-legend.component.html',
  styleUrls: ['./site-file-ingest-month-legend.component.scss']
})
export class SiteFileIngestMonthLegendComponent {
  private _month: Date = new Date();
  private _leavecodes: Workcode[] = [];
  @Input()
  public set month(dt: Date) {
    this._month = new Date(dt);
  }
  get month(): Date {
    return this._month;
  }
  @Input()
  public set leavecodes(codes: IWorkcode[]) {
    this._leavecodes = [];
    codes.forEach(code => {
      this._leavecodes.push(new Workcode(code));
    });
  }
  get leavecodes(): Workcode[] {
    return this._leavecodes;
  }
}
