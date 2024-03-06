import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { Team } from 'src/app/models/teams/team';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-ptoholidays-alt',
  templateUrl: './employee-ptoholidays-alt.component.html',
  styleUrls: ['./employee-ptoholidays-alt.component.scss']
})
export class EmployeePtoholidaysAltComponent {
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
  @Input() maxWidth: number = 1005;
  width: number = 500;
  year: number = (new Date()).getFullYear();
  showHolidays: boolean = false;

  constructor(
    protected empService: EmployeeService,
    protected teamService: TeamService
  ) {
    this.setShowHolidays();
    let width = window.innerWidth - 250;
    if (width < this.maxWidth) {
      this.maxWidth = width;
      if (this.showHolidays) {
        this.width = Math.floor(this.maxWidth /2);
      } else {
        this.width = this.maxWidth;
      }
    } else {
      this.width = Math.floor(this.maxWidth / 2);
    }
    this.width = (this.width > 500) ? 500 : this.width;
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

  chartWidthStyle(): string {
    let width = this.width + 2;
    if (this.showHolidays && this.maxWidth > 1000) {
      width = width * 2;
    }
    return `width: ${width}px;align-items: stretch;`
  }

  displayStyle(): string {
    let answer = "flexlayout topleft";
    if (this.maxWidth < 1000) {
      answer += " column";
    } else {
      answer += " row";
    }
    return answer;
  }
}
