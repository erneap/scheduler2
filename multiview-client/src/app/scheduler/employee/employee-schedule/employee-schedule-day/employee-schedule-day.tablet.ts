import { Component } from '@angular/core';
import { EmployeeScheduleDayComponent } from './employee-schedule-day.component';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-schedule-day-tablet',
  templateUrl: './employee-schedule-day.tablet.html',
  styleUrls: ['./employee-schedule-day.tablet.scss']
})
export class EmployeeScheduleDayTablet extends EmployeeScheduleDayComponent {

  constructor(
    protected tm: TeamService
  ) {
    super(tm);
  }

  getCellStyle(celltype: string): string {
    let iWidth = window.innerWidth;
    if (window.innerHeight < iWidth) {
      iWidth = window.innerHeight;
    }
    let width = Math.floor(iWidth / 7.5) - 1;
    if (celltype.toLowerCase() === 'month') {
      width = (width * 3) + 3;
    }
    let answer = `${this.workdayStyle}width: ${width}px;height: ${width}px;`;
    return answer;
  }

}
