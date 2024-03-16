import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { Team } from 'src/app/models/teams/team';
import { AppStateService } from 'src/app/services/app-state.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-pto-holiday-chart',
  templateUrl: './pto-holiday-chart.component.html',
  styleUrls: ['./pto-holiday-chart.component.scss']
})
export class PtoHolidayChartComponent {
  private _employee: Employee | undefined;
  @Input()
  public set employee(iEmp: IEmployee) {
    this._employee = new Employee(iEmp);
    this.setShowHolidays();
  }
  get employee(): Employee {
    if (!this._employee) {
      const iEmp = this.empService.getEmployee();
      if (iEmp) {
        return new Employee(iEmp);
      }
      return new Employee();
    }
    return this._employee;
  }
  year: number = (new Date()).getFullYear();
  showHolidays: boolean = false;

  constructor(
    protected empService: EmployeeService,
    protected teamService: TeamService,
    protected stateService: AppStateService
  ) {
    this.setShowHolidays();
  }

  updateYear(direction: string) {
    if (direction.substring(0,1).toLowerCase() === 'u') {
      this.year++;
    } else if (direction.substring(0,1).toLowerCase() === 'd') {
      this.year--;
    }
  }

  setShowHolidays() {
    this.showHolidays = false;
    this.year = (new Date()).getFullYear();
    const iTeam = this.teamService.getTeam();
    if (iTeam) {
      const team = new Team(iTeam);
      team.companies.forEach(co => {
        if (co.id.toLowerCase() === this.employee.companyinfo.company.toLowerCase()) {
          this.showHolidays = co.holidays.length > 0;
        }
      });
    }
  }

  getDisplayClass(): string {
    let answer = 'flexlayout topcenter ';
    if (this.stateService.viewWidth < 900) {
      answer += "column";
    } else {
      answer += "row";
    }
    return answer;
  }
}
