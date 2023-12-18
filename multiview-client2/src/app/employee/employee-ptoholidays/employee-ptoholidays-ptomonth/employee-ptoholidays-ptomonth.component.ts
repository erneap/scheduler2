import { Component, Input } from '@angular/core';
import { LeaveMonth } from '../employee-ptoholidays.model';

@Component({
  selector: 'app-employee-ptoholidays-ptomonth',
  templateUrl: './employee-ptoholidays-ptomonth.component.html',
  styleUrls: ['./employee-ptoholidays-ptomonth.component.scss']
})
export class EmployeePTOHolidaysPTOMonthComponent {
  private _month: LeaveMonth = new LeaveMonth();
  @Input()
  public set leaveMonth(month: LeaveMonth) {
    this._month = new LeaveMonth(month);
  }
  get leaveMonth(): LeaveMonth {
    return this._month;
  }
  months: string[] = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL",
    "AUG", "SEP", "OCT", "NOV", "DEC");

  constructor() {}

  getStyle(field: string): string {
    let answer = `${field} `;
    if (this.leaveMonth.active) {
      answer += 'active';
    } else {
      answer += 'disabled';
    }
    return answer;
  }

  getActualHours(): string {
    let total = 0.0;
    this._month.leaveGroups.forEach(lg => {
      lg.leaves.forEach(lv => {
        if (lv.status.toLowerCase() === 'actual' && lv.code.toLowerCase() === 'v') {
          total += lv.hours
        }
      });
    })
    return total.toFixed(1);
  }

  getProjectedHours(): string {
    let total = 0.0;
    this._month.leaveGroups.forEach(lg => {
      lg.leaves.forEach(lv => {
        if (lv.status.toLowerCase() !== 'actual' && lv.code.toLowerCase() === 'v') {
          total += lv.hours
        }
      });
    })
    return total.toFixed(1);
  }
}
