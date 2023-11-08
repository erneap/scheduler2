import { Component } from '@angular/core';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';
import { EmployeePTOHolidayChartComponent } from '../employee-ptoholiday-chart/employee-ptoholiday-chart.component';

@Component({
  selector: 'app-employee-ptoholidays-chart',
  templateUrl: './employee-ptoholidays-chart.mobile.html',
  styleUrls: ['./employee-ptoholidays-chart.mobile.scss']
})
export class EmployeePTOHolidaysChartMobile extends EmployeePTOHolidayChartComponent {
  constructor(
    protected es: EmployeeService,
    protected ts: TeamService
  ) {
    super(es, ts);
  }
}
