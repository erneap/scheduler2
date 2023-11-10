import { Component, Input } from '@angular/core';
import { Workcode } from 'src/app/models/teams/workcode';

@Component({
  selector: 'app-employee-leave-request-legend',
  templateUrl: './employee-leave-request-legend.component.html',
  styleUrls: ['./employee-leave-request-legend.component.scss']
})
export class EmployeeLeaveRequestLegendComponent {
  @Input() leavecodes: Workcode[] = [];

  constructor() {

  }

  setLeave(code: string): string {
    let answer = 'background-color: white; color: black;';
    this.leavecodes.forEach(wc => {
      if (wc.id.toLowerCase() == code.toLowerCase()) {
        answer = `background-color: #${wc.backcolor};color: #${wc.textcolor};`;
      }
    });
    return answer;
  }
}
