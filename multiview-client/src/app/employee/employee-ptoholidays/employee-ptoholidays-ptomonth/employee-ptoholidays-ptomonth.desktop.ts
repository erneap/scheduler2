import { Component, Input } from '@angular/core';
import { EmployeePTOHolidaysPTOMonthComponent } from './employee-ptoholidays-ptomonth.component';

@Component({
  selector: 'app-employee-ptoholidays-ptomonth-desktop',
  templateUrl: './employee-ptoholidays-ptomonth.desktop.html',
  styleUrls: ['./employee-ptoholidays-ptomonth.desktop.scss']
})
export class EmployeePTOHolidaysPTOMonthDesktop 
  extends EmployeePTOHolidaysPTOMonthComponent {
  @Input() width: number = 0;
  constructor() {
    super();
  }

  getWidthStyle(column: string): string {
    let width = this.width;
    if (width === 0) {
      width = window.innerWidth;
    }
    if (width > 1000) {
      width = 1000;
    }
    width = Math.floor(width/2);
    if (column.toLowerCase() === 'dates') {
      width = Math.floor(width * 0.52);
    } else {
      width = Math.floor(width * 0.16) - 3;
    }
    return `width: ${width}px;`;
  }
}
