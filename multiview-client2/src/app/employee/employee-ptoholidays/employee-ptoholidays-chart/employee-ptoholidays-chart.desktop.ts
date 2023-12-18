import { Component, Input } from '@angular/core';
import { EmployeePTOHolidayChartComponent } from '../employee-ptoholiday-chart/employee-ptoholiday-chart.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-ptoholidays-chart-desktop',
  templateUrl: './employee-ptoholidays-chart.desktop.html',
  styleUrls: ['./employee-ptoholidays-chart.desktop.scss']
})
export class EmployeePTOHolidaysChartDesktop extends EmployeePTOHolidayChartComponent {
  @Input() width: number = 0;
  constructor(
    protected es: EmployeeService,
    protected ts: TeamService
  ) {
    super(es, ts);
  }
}
