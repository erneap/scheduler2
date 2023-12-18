import { Component } from '@angular/core';
import { EmployeeScheduleDayComponent } from './employee-schedule-day.component';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-schedule-day-mobile',
  templateUrl: './employee-schedule-day.mobile.html',
  styleUrls: ['./employee-schedule-day.mobile.scss']
})
export class EmployeeScheduleDayMobile extends EmployeeScheduleDayComponent{

  constructor(
    protected tm: TeamService
  ) {
    super(tm);
  }

  getCellStyle(celltype: string): string {
    let iWidth = window.innerWidth;
    if (window.innerHeight < iWidth) {
      iWidth = window.innerHeight - 25;
    }
    let width = Math.floor(iWidth / 7.5) - 1;
    if (celltype.toLowerCase() === 'month') {
      width = (width * 3) + 3;
    }
    let answer = `${this.workdayStyle}width: ${width}px;height: ${width}px;`;
    return answer;
  }

}
