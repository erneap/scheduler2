import { Component, Input } from '@angular/core';
import { ListItem } from 'src/app/generic/button-list/listitem';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { SpecialtyType } from 'src/app/models/teams/contacttype';
import { ITeam, Team } from 'src/app/models/teams/team';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-employee-specialties',
  templateUrl: './employee-specialties.component.html',
  styleUrls: ['./employee-specialties.component.scss']
})
export class EmployeeSpecialtiesComponent {
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
    this.setContactTypes();
  }
  get employee(): Employee {
    return this._employee;
  }
  available: ListItem[] = [];
  specialties: ListItem[] = [];
  availableSelected: string[] = [];
  specialtiesSelected: string[] = []

  constructor(
    protected teamService: TeamService,
    protected empService: EmployeeService,
    protected dialogService: DialogService,
    protected authService: AuthService
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
    this.available = [];
    this.specialties = [];
    this.team.specialties = this.team.specialties.sort((a,b) => a.compareTo(b));
    this.team.specialties.forEach(sp => {
      let found = false;
      this.employee.specialties.forEach(esp => {
        console.log(`${esp.specialtyid} === ${sp.id} - ${esp.specialtyid === sp.id}`);
        if (esp.specialtyid === sp.id) {
          found = true;
          this.specialties.push(new ListItem(`${esp.id}`, sp.name));
        }
      });
      if (!found) {
        this.available.push(new ListItem(`${sp.id}`, sp.name));
      }
    });
  }

  updatedEmployee(emp: Employee) {
    this.empService.setEmployee(emp);
    this.employee = emp;
  }

  getButtonClass(id: string, list: string) {
    let answer = "employee";
    if (list.toLowerCase() === 'available') {
      this.availableSelected.forEach(sel => {
        if (sel === id) {
          answer += " selected";
        }
      });
    } else {
      this.specialtiesSelected.forEach(sel => {
        if (sel === id) {
          answer += " selected";
        }
      });
    }
    return answer;
  }

  onSelect(id: string, list: string) {
    let pos = -1;
    if (list.toLowerCase() === 'available') {
      for (let i=0; i < this.availableSelected.length && pos < 0; i++) {
        if (this.availableSelected[i] === id) {
          pos = i;
        }
      }
      if (pos < 0) {
        this.availableSelected.push(id);
      } else {
        this.availableSelected.splice(pos, 1);
      }
    } else {
      for (let i=0; i < this.specialtiesSelected.length && pos < 0; i++) {
        if (this.specialtiesSelected[i] === id) {
          pos = i;
        }
      }
      if (pos < 0) {
        this.specialtiesSelected.push(id);
      } else {
        this.specialtiesSelected.splice(pos, 1);
      }
    }
  }

  onSetChanges(list: string) {
    const specialties: number[] = [];
    let action = '';
    if (list.toLowerCase() === 'available') {
      action = 'add';
      this.availableSelected.forEach(sel => {
        specialties.push(Number(sel));
      });
      this.availableSelected = [];
    } else {
      action = "delete";
      this.specialtiesSelected.forEach(sel => {
        specialties.push(Number(sel));
      });
      this.specialtiesSelected = [];
    }
    if (specialties.length > 0) {
      this.dialogService.showSpinner();
      this.authService.statusMessage = "Updating Employee Specialties";
      this.empService.updateEmployeeSpecialties(this.employee.id, action, 
        specialties).subscribe({
        next: (resp: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (resp.employee) {
            this.empService.setEmployee(resp.employee);
            this.employee = resp.employee;
          }
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = `Error: onSetChanges: ${err.exception}`;
        }
      });
    }
  }
}