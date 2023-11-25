import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ListItem } from 'src/app/models/generic/listitem';
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
  @Output() changed = new EventEmitter<Employee>();
  available: ListItem[] = [];
  specialties: ListItem[] = [];
  form: FormGroup;

  constructor(
    protected teamService: TeamService,
    protected empService: EmployeeService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private formBuilder: FormBuilder
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
    this.form = this.formBuilder.group({
      available: [],
      specialties: [],
    })
  }

  setContactTypes() {
    this.available = [];
    this.specialties = [];
    this.team.specialties = this.team.specialties.sort((a,b) => a.compareTo(b));
    this.team.specialties.forEach(sp => {
      let found = false;
      this.employee.specialties.forEach(esp => {
        if (esp.specialtyid === sp.id) {
          found = true;
          this.specialties.push(new ListItem(`${esp.id}`, sp.name, esp.sort));
        }
      });
      if (!found) {
        this.available.push(new ListItem(`${sp.id}`, sp.name, sp.sort));
      }
    });
  }

  updatedEmployee(emp: Employee) {
    this.employee = emp;
    this.changed.emit(this.employee);
  }

  getButtonClass(id: string, list: string) {
    let answer = "employee";
    if (list.toLowerCase() === 'available') {
      this.available.forEach(sel => {
        if (sel.id === id && sel.selected) {
          answer += " selected";
        }
      });
    } else {
      this.specialties.forEach(sel => {
        if (sel.id === id && sel.selected) {
          answer += " selected";
        }
      });
    }
    return answer;
  }

  onSetChanges(list: string) {
    const specialties: number[] = [];
    let action = '';
    if (list.toLowerCase() === 'available') {
      const items: string[] = this.form.value.available;
      if (items && items.length) {
        action = 'add';
        items.forEach(item => {
          specialties.push(Number(item))
        });
      }
      this.form.controls['available'].setValue([]);
    } else {
      const items: string[] = this.form.value.specialties;
      if (items && items.length) {
        action = 'delete';
        items.forEach(item => {
          specialties.push(Number(item))
        });
      }
      this.form.controls['specialties'].setValue([]);
    }
    if (action !== '' && specialties.length > 0) {
      this.dialogService.showSpinner();
      this.authService.statusMessage = "Updating Employee Specialties";
      this.empService.updateEmployeeSpecialties(this.employee.id, action, 
        specialties).subscribe({
        next: (resp: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (resp.employee) {
            this.employee = new Employee(resp.employee);
            const iEmp = this.empService.getEmployee();
            if (iEmp && iEmp.id === this.employee.id) {
              this.empService.setEmployee(this.employee);
            }
            this.changed.emit(this.employee);
          }
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = `Error: onSetChanges: ${err.exception}`;
        }
      });
    }
  }

  setLayout(): string {
    let answer = "flexlayout column center";
    const width = window.innerWidth;
    if (width > 700) {
      answer = "flexlayout row center";
    }
    return answer;
  }
}