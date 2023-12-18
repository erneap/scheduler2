import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ContactType } from 'src/app/models/teams/contacttype';
import { ITeam, Team } from 'src/app/models/teams/team';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-contact-info',
  templateUrl: './employee-contact-info.component.html',
  styleUrls: ['./employee-contact-info.component.scss']
})
export class EmployeeContactInfoComponent {
  private _team: Team = new Team();
  @Input()
  public set team(tm: ITeam) {
    this._team = new Team(tm);
    this.setContactTypes();
  }
  get team(): Team {
    return this._team;
  }
  private _employee: Employee = new Employee();
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
  }
  get employee(): Employee {
    return this._employee;
  }
  @Output() changed = new EventEmitter<Employee>();
  contactTypes: ContactType[] = []

  constructor(
    protected teamService: TeamService,
    protected empService: EmployeeService
  ) {
    if (this.team.id === '') {
      const tm = this.teamService.getTeam();
      if (tm) {
        this.team = tm;
      }
    }
    if (this.employee.id === '') {
      const emp = this.empService.getEmployee();
      if (emp) {
        this.employee = emp;
      }
    }
  }

  setContactTypes() {
    this.contactTypes = [];
    if (this.team) {
      this.team.contacttypes.forEach(ct => {
        this.contactTypes.push(new ContactType(ct));
      });
    }
    this.contactTypes = this.contactTypes.sort((a,b) => a.compareTo(b))
  }

  updatedEmployee(emp: Employee) {
    this.employee = emp;
    const iEmp = this.empService.getEmployee();
    if (iEmp && iEmp.id === emp.id) {
      this.empService.setEmployee(emp);
    }
    this.changed.emit(this.employee);
  }
}
