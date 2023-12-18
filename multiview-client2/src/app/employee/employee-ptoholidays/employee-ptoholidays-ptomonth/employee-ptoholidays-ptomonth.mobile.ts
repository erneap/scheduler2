import { Component } from '@angular/core';
import { EmployeePTOHolidaysPTOMonthComponent } from './employee-ptoholidays-ptomonth.component';

@Component({
  selector: 'app-employee-ptoholidays-ptomonth-mobile',
  templateUrl: './employee-ptoholidays-ptomonth.mobile.html',
  styleUrls: ['./employee-ptoholidays-ptomonth.mobile.scss']
})
export class EmployeePTOHolidaysPTOMonthMobile extends EmployeePTOHolidaysPTOMonthComponent {
  constructor() {
    super();
  }

  getWidthStyle(column: string): string {
    let width = window.innerWidth;
    if (window.innerHeight < window.innerWidth) {
      width = Math.floor(width/2);
    }
    if (column.toLowerCase() === 'dates') {
      width = Math.floor(width * 0.52) - 1;
    } else {
      width = Math.floor(width * 0.16) - 1;
    }
    return `width: ${width}px;`;
  }
}
