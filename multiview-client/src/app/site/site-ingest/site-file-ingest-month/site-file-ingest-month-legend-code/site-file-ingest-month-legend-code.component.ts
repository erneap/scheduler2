import { Component, Input } from '@angular/core';
import { IWorkcode, Workcode } from 'src/app/models/teams/workcode';

@Component({
  selector: 'app-site-file-ingest-month-legend-code',
  templateUrl: './site-file-ingest-month-legend-code.component.html',
  styleUrls: ['./site-file-ingest-month-legend-code.component.scss']
})
export class SiteFileIngestMonthLegendCodeComponent {
  private _leavecode: Workcode = new Workcode();
  @Input()
  public set leavecode(lc: IWorkcode) {
    this._leavecode = new Workcode(lc);
    this.setLeaveCode();
  }
  get leavecode(): Workcode {
    return this._leavecode;
  }

  divStyle: string = '';

  setLeaveCode() {
    this.divStyle = `background-color: #${this.leavecode.backcolor};`
      + `color: #${this.leavecode.textcolor};`
      + `border: solid 1px #${this.leavecode.textcolor};`;
  }
}
