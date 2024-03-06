import { Component, Input } from '@angular/core';
import { LeaveMonth } from 'src/app/scheduler/employee/employee-ptoholidays-alt/employee-ptoholidays.model';

@Component({
  selector: 'app-employee-ptoholidays-alt-pto-cell',
  templateUrl: './employee-ptoholidays-alt-pto-cell.component.html',
  styleUrls: ['./employee-ptoholidays-alt-pto-cell.component.scss']
})
export class EmployeePtoholidaysAltPtoCellComponent {
  private _month: LeaveMonth = new LeaveMonth();
  @Input()
  public set leaveMonth(month: LeaveMonth) {
    this._month = new LeaveMonth(month);
  }
  get leaveMonth(): LeaveMonth {
    return this._month;
  }
  @Input() width: number = 502;
  months: string[] = new Array("JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL",
    "AUG", "SEP", "OCT", "NOV", "DEC");

  constructor() {}

  getStyle(field: string): string {
    let answer = '';
    switch (field.toLowerCase()) {
      case "month":
        answer = "month";
        break;
      case "code":
        answer = "code";
        break;
      case "dates":
        answer = "dates";
        break;
      case "reference":
        answer = "reference";
        break;
      default:
        answer = "hours";
        break;
    }

    if (this.leaveMonth.month.getTime() === 0) {
      answer += ' titles';
    } else if (field.toLowerCase() === 'month' || field.toLowerCase() === 'code') {
      answer += " red";
    } else {
      if (this.leaveMonth.active) {
        answer += ' normal';
      } else {
        answer += ' disabled';
      }
    }
    if (field.toLowerCase() === 'requested') {
      answer += ' projected ';
    }
    return answer;
  }

  setWidth(): string {
    return `width: ${this.width}px;`;
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
