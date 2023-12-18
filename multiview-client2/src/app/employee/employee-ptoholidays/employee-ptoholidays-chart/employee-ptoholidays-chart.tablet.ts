import { Component } from '@angular/core';
import { EmployeePTOHolidayChartComponent } from '../employee-ptoholiday-chart/employee-ptoholiday-chart.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-ptoholidays-chart',
  templateUrl: './employee-ptoholidays-chart.tablet.html',
  styleUrls: ['./employee-ptoholidays-chart.tablet.scss']
})
export class EmployeePTOHolidaysChartTablet extends EmployeePTOHolidayChartComponent {
  constructor(
    protected es: EmployeeService,
    protected ts: TeamService
  ) {
    super(es, ts);
  }

  chartWidthStyle(): string {
    let width = window.innerWidth - 1 
    return `width: ${width}px;`
  }

  displayStyle(): string {
    let answer = "flexlayout center";
    if (window.innerWidth < window.innerHeight) {
      answer += " column";
    } else {
      answer += " row";
    }
    return answer;
  }
}
