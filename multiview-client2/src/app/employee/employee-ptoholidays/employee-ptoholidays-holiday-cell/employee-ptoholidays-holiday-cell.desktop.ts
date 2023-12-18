import { Component, Input } from '@angular/core';
import { EmployeePTOHolidaysHolidayCellComponent } from './employee-ptoholidays-holiday-cell.component';

@Component({
  selector: 'app-employee-ptoholidays-holiday-cell-desktop',
  templateUrl: './employee-ptoholidays-holiday-cell.desktop.html',
  styleUrls: ['./employee-ptoholidays-holiday-cell.desktop.scss']
})
export class EmployeePTOHolidaysHolidayCellDesktop 
  extends EmployeePTOHolidaysHolidayCellComponent {
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
    switch (column.toLowerCase()) {
      case 'title':
        width = width - 2;
        break;
      case 'dates':
        width = Math.floor(width * 0.52);
        break;
      case 'code':
        width = Math.floor(width * 0.12) - 1;
        break;
      case 'bottom':
        width = Math.floor(width * 0.35) - 1;
        break;
      case 'reference':
        width = Math.floor(width * 0.18);
        break;
      case 'hours':
        width = Math.floor(width * 0.18);
        break;
      default:
        width = Math.floor(width * 0.18) - 1;
        break;
    }
    return `width: ${width}px;`;
  }
}
