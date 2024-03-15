import { Component, Input } from '@angular/core';
import { IWorkday, Workday } from 'src/app/models/employees/assignments';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { Workcode } from 'src/app/models/teams/workcode';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-schedule-day',
  templateUrl: './employee-schedule-day.component.html',
  styleUrls: ['./employee-schedule-day.component.scss']
})
export class EmployeeScheduleDayComponent {
  private _workday: Workday = new Workday();
  private _month: Date = new Date();
  @Input() 
  public set workday(wd: Workday) {
    if (!wd) {
      wd = new Workday();
    }
    this._workday = wd;
  }
  get workday(): Workday {
    return this._workday;
  }
  @Input() 
  public set month(date: Date) {
    this._month = new Date(date);
  }
  get month(): Date {
    return this._month;
  }
  @Input() workcenters: Workcenter[] = [];
  @Input() width: number = 100;

  constructor(
    protected teamService: TeamService,
  ) { }

  getDateClass() : string {
    const today = new Date();
    let classes = 'dayOfMonth ';
    if (this.workday && this.workday.date) {
      if (today.getFullYear() === this.workday.date.getUTCFullYear() 
        && today.getMonth() === this.workday.date.getUTCMonth()
        && today.getDate() === this.workday.date.getUTCDate()) {
        classes += "today";
      } else if (this.workday.date.getUTCDay() === 0 
        || this.workday.date.getUTCDay() === 6) {
        classes += "weekend";
      } else {
        classes += "weekday";
      }
    } else {
      classes += "weekday";
    }
    return classes;
  }

  getDateStyles(): string {
    if (this.width > 100) {
      this.width = 100;
    }
    const cWidth = (this.width / 4);
    const fontSize = 1.1 * (cWidth / 25);
    return `height: ${cWidth}px;width: ${cWidth}px;font-size: ${fontSize}em;`;
  }

  getWorkdayStyle(): string {
    if (this.width > 100) {
      this.width = 100;
    }
    let bkColor = 'ffffff';
    let txColor = '000000';
    if (this.workday && this.workday.code !== "") {
      // find the workcode setting from the team
      const team = this.teamService.getTeam()
      if (team) {
        let found = false;
        for (let i=0; i < team.workcodes.length && !found; i++) {
          let wc: Workcode = team.workcodes[i];
          if (wc.id.toLowerCase() === this.workday.code.toLowerCase()) {
            found = true;
            bkColor = wc.backcolor;
            txColor = wc.textcolor;
            if (wc.backcolor.toLowerCase() === 'ffffff' 
              && this.workday.date?.getMonth() !== this.month.getMonth())  {
              bkColor = 'C0C0C0';
              txColor = '000000';
            }
          }
        }
      }
    } else if (this.workday?.date?.getMonth() !== this.month.getMonth()) {
      bkColor = 'C0C0C0';
      txColor = '000000';
    } else {
      bkColor = 'ffffff';
      txColor = '000000';
    }
    return `height: ${this.width}px;width: ${this.width}px;`
      + `background-color: $${bkColor};color: #${txColor};`;
  }

  getWorkcenter(): string {
    if (this.workday) {
      let answer = '';
      this.workcenters.forEach(wc => {
        if (this.workday.workcenter === wc.id) {
          answer = wc.name;
        }
      });
      return answer;
    }
    return '';
  }
}
