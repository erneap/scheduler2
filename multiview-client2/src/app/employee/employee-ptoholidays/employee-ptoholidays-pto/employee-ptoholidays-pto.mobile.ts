import { Component } from '@angular/core';
import { EmployeePTOHolidaysPTOComponent } from './employee-ptoholidays-pto.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-employee-ptoholidays-pto-mobile',
  templateUrl: './employee-ptoholidays-pto.mobile.html',
  styleUrls: ['./employee-ptoholidays-pto.mobile.scss']
})
export class EmployeePTOHolidaysPTOMobile extends EmployeePTOHolidaysPTOComponent {
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService
  ) {
    super(es, ss);
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
      case 'bottom':
        width = Math.floor(width * 0.20) - 1;
        break;
      default:
        width = Math.floor(width * 0.16) - 1;
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
