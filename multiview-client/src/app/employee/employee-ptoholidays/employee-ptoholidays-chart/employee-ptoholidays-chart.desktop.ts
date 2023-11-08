import { Component } from '@angular/core';
import { EmployeePTOHolidayChartComponent } from '../employee-ptoholiday-chart/employee-ptoholiday-chart.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-ptoholidays-chart',
  templateUrl: './employee-ptoholidays-chart.desktop.html',
  styleUrls: ['./employee-ptoholidays-chart.desktop.scss']
})
export class EmployeePTOHolidaysChartDesktop extends EmployeePTOHolidayChartComponent {
  constructor(
    protected es: EmployeeService,
    protected ts: TeamService
  ) {
    super(es, ts);
  }

  chartWidthStyle(): string {
    let width = 31.9;
    if (this.showHolidays) {
      width += 33.3;
    }
    return `width: ${width}rem;`
  }
}
