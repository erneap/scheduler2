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
  width: number = 500;
  year: number = (new Date()).getFullYear();
  showHolidays: boolean = false;

  constructor(
    protected empService: EmployeeService,
    protected teamService: TeamService
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

  chartWidthStyle(): string {
    let width = window.innerWidth - 1;
    if (width > 1000) {
      width = 1000;
    } else if ((window.innerWidth < window.innerHeight || !this.showHolidays) 
      && width > 498) {
      width = 498;
    }
    if (window.innerWidth < window.innerHeight || !this.showHolidays) {
      this.width = width - 1;
    } else {
      this.width = Math.floor(width/2) - 2;
    }
    return `width: ${width}px;align-items: stretch;`
  }

  displayStyle(): string {
    let answer = "flexlayout topleft";
    if (window.innerWidth < window.innerHeight) {
      answer += " column";
    } else {
      answer += " row";
    }
    return answer;
  }
}
