import { Workday } from "src/app/models/employees/assignments";
import { Workcenter } from "src/app/models/sites/workcenter";
import { Workcode } from "src/app/models/teams/workcode";
import { TeamService } from "src/app/services/team.service";

export abstract class EmployeeScheduleDay {
  private _workday: Workday = new Workday();
  private _month: Date = new Date();
  private _workcenters: Workcenter[] = [];

  dateClass: string = "dayOfMonth";
  workdayStyle: string = "background-color: white;color: black;"
  public set workday(wd: Workday) {
    if (!wd) {
      this._workday = new Workday();
    } else {
      this._workday = new Workday(wd);
    }
    this.setDateClass();
    this.setWorkdayStyle();
  }
  public set month(date: Date) {
    this._month = new Date(date);
    this.setWorkdayStyle();
  }
  get month(): Date {
    return this._month;
  }
  public set workcenters(wkctrs: Workcenter[]) {
    this._workcenters = [];
    wkctrs.forEach(wk => {
      this._workcenters.push(new Workcenter(wk))
    })
  }
  get workcenters(): Workcenter[] {
    return this._workcenters;
  }

  constructor(
    protected teamService: TeamService,
  ) { }

  setDateClass() {
    const today = new Date();
    if (this.workday && this.workday.date) {
      if (today.getFullYear() === this.workday.date.getUTCFullYear() 
        && today.getMonth() === this.workday.date.getUTCMonth()
        && today.getDate() === this.workday.date.getUTCDate()) {
        this.dateClass = "dayOfMonth today";
      } else if (this.workday.date.getUTCDay() === 0 
        || this.workday.date.getUTCDay() === 6) {
        this.dateClass = "dayOfMonth weekend";
      } else {
        this.dateClass = "dayOfMonth weekday";
      }
    } else {
      this.dateClass = "dayOfMonth weekday";
    }
  }

  setWorkdayStyle() {
    if (this.workday && this.workday.code !== "") {
      // find the workcode setting from the team
      const team = this.teamService.getTeam()
      if (team) {
        let found = false;
        for (let i=0; i < team.workcodes.length && !found; i++) {
          let wc: Workcode = team.workcodes[i];
          if (wc.id.toLowerCase() === this.workday.code.toLowerCase()) {
            found = true;
            this.workdayStyle = `background-color:#${wc.backcolor};`
              + `color:#${wc.textcolor};`;
            if (wc.backcolor.toLowerCase() === 'ffffff' 
              && this.workday.date?.getMonth() !== this.month.getMonth())  {
              this.workdayStyle = 'background-color: #C0C0C0;color:#000000;';
            }
          }
        }
      }
    } else if (this.workday?.date?.getMonth() !== this.month.getMonth()) {
      this.workdayStyle = 'background-color: #C0C0C0;color:#000000;';
    } else {
      this.workdayStyle = 'background-color: #FFFFFF;color:#000000;';
    }
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
