import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ContactType } from 'src/app/models/teams/contacttype';
import { ITeam, Team } from 'src/app/models/teams/team';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-contact-info',
  templateUrl: './employee-contact-info.component.html',
  styleUrls: ['./employee-contact-info.component.scss']
})
export class EmployeeContactInfoComponent {
  private _team: Team | undefined;
  @Input()
  public set team(tm: ITeam) {
    this._team = new Team(tm);
    this.setContactTypes();
  }
  get team(): Team | undefined {
    return this._team;
  }
  private _employee: Employee | undefined;
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
  }
  get employee(): Employee | undefined {
    return this._employee;
  }
  contactTypes: ContactType[] = []

  constructor(
    protected teamService: TeamService
  ) {
    if (!this.team) {
      const tm = this.teamService.getTeam();
      if (tm) {
        this.team = tm;
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
}
