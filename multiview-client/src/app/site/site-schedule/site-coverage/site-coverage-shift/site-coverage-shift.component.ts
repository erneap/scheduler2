import { Component, Input } from '@angular/core';
import { IShift, Shift } from 'src/app/models/sites/workcenter';

@Component({
  selector: 'app-site-coverage-shift',
  templateUrl: './site-coverage-shift.component.html',
  styleUrls: ['./site-coverage-shift.component.scss']
})
export class SiteCoverageShiftComponent {
  private _workcenter: string = ''
  private _shift: Shift = new Shift();
  private _date: Date = new Date();
  private _lastWorked: Date = new Date(0);
  @Input()
  public set workcenter(wkc: string) {
    this._workcenter = wkc;
  }
  get workcenter(): string {
    return this._workcenter;
  }
  @Input()
  public set shift(id: IShift) {
    this._shift = new Shift(id);
  }
  get shift(): Shift {
    return this._shift;
  }
  @Input()
  public set month(dt: Date) {
    this._date = new Date(dt);
    this.setMonth();
  }
  get month(): Date {
    return this._date;
  }
  dates: Date[] = [];
  startDate: Date = new Date();
  endDate: Date = new Date();
  private _period: number = 30;
  @Input()
  public set period(days: number) {
    this._period = days;
    this.setMonth();
  }
  get period(): number {
    return this._period;
  }
  @Input()
  public set lastWorked(last: Date) {
    this._lastWorked = new Date(last);
  }
  public get lastWorked(): Date {
    return this._lastWorked
  }

  constructor() {}

  setMonth() {
    this.dates = [];
    if (this.period > 28) {
      this.startDate = new Date(Date.UTC(this.month.getFullYear(), 
        this.month.getMonth(), 1, 0, 0, 0));
      this.endDate = new Date(Date.UTC(this.month.getFullYear(), 
        this.month.getMonth() + 1, 1, 0, 0, 0));
    } else {
      this.startDate = new Date(Date.UTC(this.month.getFullYear(), 
        this.month.getMonth(), this.month.getDate(), 0, 0, 0, 0));
      while (this.startDate.getDay() !== 0) {
        this.startDate = new Date(this.startDate.getTime() - (24 * 3600000));
      }
      this.endDate = new Date(this.startDate.getTime() + (this.period 
        * (24 * 3600000)));
    }
    
    let start = new Date(this.startDate);

    this.dates = [];
    while (start.getTime() < this.endDate.getTime()) {
      this.dates.push(new Date(start));
      start = new Date(start.getTime() + (24 * 3600000));
    }
  }
}
