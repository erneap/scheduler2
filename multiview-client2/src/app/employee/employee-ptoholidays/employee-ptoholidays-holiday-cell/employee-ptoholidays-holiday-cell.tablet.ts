import { Component } from '@angular/core';
import { EmployeePTOHolidaysHolidayCellComponent } from './employee-ptoholidays-holiday-cell.component';

@Component({
  selector: 'app-employee-ptoholidays-holiday-cell-tablet',
  templateUrl: './employee-ptoholidays-holiday-cell.tablet.html',
  styleUrls: ['./employee-ptoholidays-holiday-cell.tablet.scss']
})
export class EmployeePTOHolidaysHolidayCellTablet extends EmployeePTOHolidaysHolidayCellComponent {
  constructor() {
    super();
  }

  getWidthStyle(column: string): string {
    let width = window.innerWidth;
    if (window.innerHeight < window.innerWidth) {
      width = Math.floor(width/2);
    }
    switch (column.toLowerCase()) {
      case 'title':
        width = width - 2;
        break;
      case 'dates':
        width = Math.floor(width * 0.52) - 1;
        break;
      case 'code':
        width = Math.floor(width * 0.12) - 1;
        break;
      case 'bottom':
        width = Math.floor(width * 0.35) - 1;
        break;
      default:
        width = Math.floor(width * 0.18) - 1;
        break;
    }
    return `width: ${width}px;`;
  }
}
