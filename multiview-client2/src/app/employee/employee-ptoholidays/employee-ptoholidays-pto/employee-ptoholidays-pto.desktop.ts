import { Component, Input } from '@angular/core';
import { EmployeePTOHolidaysPTOComponent } from './employee-ptoholidays-pto.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-employee-ptoholidays-pto-desktop',
  templateUrl: './employee-ptoholidays-pto.desktop.html',
  styleUrls: ['./employee-ptoholidays-pto.desktop.scss']
})
export class EmployeePTOHolidaysPTODesktop extends EmployeePTOHolidaysPTOComponent {
  @Input() width: number = 0;
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService
  ) {
    super(es, ss);
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
        width = Math.floor(width * 0.52) - 1;
        break;
      case 'code':
        width = Math.floor(width * 0.12) - 1;
        break;
      case 'bottom':
        width = Math.floor(width * 0.20) - 2;
        break;
      default:
        width = Math.floor(width * 0.16) - 2;
        break;
    }
    return `width: ${width}px;`;
  }

  balanceClass(): string {
    if (this.balanceStyle.toLowerCase() === 'balancepos') {
      return 'data positive';
    } else {
      return 'data negative';
    }
  }
}
