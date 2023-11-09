import { Component } from '@angular/core';
import { EmployeePTOHolidaysPTOMonthComponent } from './employee-ptoholidays-ptomonth.component';

@Component({
  selector: 'app-employee-ptoholidays-ptomonth-tablet',
  templateUrl: './employee-ptoholidays-ptomonth.tablet.html',
  styleUrls: ['./employee-ptoholidays-ptomonth.tablet.scss']
})
export class EmployeePTOHolidaysPTOMonthTablet extends EmployeePTOHolidaysPTOMonthComponent {
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
