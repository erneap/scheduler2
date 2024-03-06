import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { Employee } from 'src/app/models/employees/employee';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { Message } from 'src/app/models/web/employeeWeb';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-employees',
  templateUrl: './site-employees.component.html',
  styleUrls: ['./site-employees.component.scss']
})
export class SiteEmployeesComponent {
  private _site: Site = new Site();
  @Input()
  public set site(site: ISite) {
    this._site = new Site(site);
    this.setEmployees();
  }
  get site(): Site {
    return this._site;
  }
  private _team: Team = new Team();
  @Input()
  public set team(iteam: ITeam) {
    this._team = new Team(iteam);
    this.setEmployees();
  }
  get team(): Team {
    return this._team;
  }
  @Input() maxWidth: number = window.innerWidth - 500;
  @Output() changed = new EventEmitter<Site>();
  employeeSelectionForm: FormGroup;
  selectedEmployee: Employee = new Employee();
  siteEmployees: Employee[] = [];
  activeOnly: boolean = true;

  constructor(
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    const emp = this.empService.getEmployee();
    let empID = '';
    if (emp) {
      empID = emp.id;
    }
    this.employeeSelectionForm = this.fb.group({
      employee: empID,
      activeOnly: true,
    });
    const site = this.siteService.getSite();
    if (site) {
      this.site = site;
    }
    this.selectEmployee(empID);
  }

  setEmployees(): void {
    this.siteEmployees = [];
    const active = this.employeeSelectionForm.value.activeOnly;
    if (this.site) {
      if (this.site.employees && this.site.employees.length > 0) {
        this.site.employees.forEach(iEmp => {
          const emp = new Employee(iEmp);
          if ((active && emp.isActive()) || !active) {
            this.siteEmployees.push(emp);
          }
        });
        this.siteEmployees.sort((a,b) => a.compareTo(b));
      } else {
        if (this.team.id !== '') {
          // get the site again because the employees weren't loaded 
          this.dialogService.showSpinner();
          this.siteService.retrieveSite(this.team.id, this.site.id, true)
          .subscribe({
            next: (data: SiteResponse) => {
              this.dialogService.closeSpinner();
              if (data && data.site) {
                this.site = new Site(data.site);
                this.changed.emit(this.site);
              }
            },
            error: (err: SiteResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
        }
      }
      const empID = this.selectedEmployee.id;
      let eFound = false;
      this.siteEmployees.forEach(emp => {
        if (emp.id === empID) {
          eFound = true;
        }
      });
      if (!eFound) {
        this.selectedEmployee = new Employee();
        this.employeeSelectionForm.controls['employee'].setValue('');
      }
    } 
    if (this.siteEmployees.length > 0) {
      if (this.selectedEmployee.id !== '') {
        this.employeeSelectionForm.controls['employee']
          .setValue(this.selectedEmployee.id);
      } else {
        this.selectedEmployee = new Employee(this.siteEmployees[0])
        this.employeeSelectionForm.controls['employee']
          .setValue(this.selectedEmployee.id);
      }
    }
  }

  selectEmployee(empID: string): void {
    if (empID === 'new') {
      this.selectedEmployee = new Employee();
      this.selectedEmployee.id = 'new';
    } else {
      if (this.site && this.site.employees) {
        this.site.employees.forEach(emp => {
          if (empID.toLowerCase() === emp.id.toLowerCase()) {
            this.selectedEmployee = new Employee(emp);
          }
        });
      }
    }
  }

  updateEmployee(emp: Employee) {
    const oEmp = this.empService.getEmployee();
    const oSite = this.siteService.getSite();
    const oTeam = this.teamService.getTeam();
    if (emp.id === this.selectedEmployee.id) {
      this.selectedEmployee = new Employee(emp);
    }
    if (oEmp && oEmp.id === emp.id) {
      this.empService.setEmployee(emp);
    }
    if (this.site.employees) {
      let found = false;
      for (let i=0; i < this.site.employees.length && !found; i++) {
        if (this.site.employees[i].id === emp.id) {
          this.site.employees[i] = new Employee(emp);
          found = true;
        }
      }
      this.changed.emit(this.site);
    }
    if (oSite && oSite.id === this.site.id) {
      this.siteService.setSite(this.site);
    }
    if (this.team.sites) {
      let found = false;
      for (let i=0; i < this.team.sites.length && !found; i++) {
        if (this.team.sites[i].id === this.site.id) {
          this.team.sites[i] = new Site(this.site);
          found = true;
        }
      }
    }
    if (oTeam && oTeam.id === this.team.id) {
      this.teamService.setTeam(this.team);
    }
  }

  deleteEmployee() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Employee Deletion',
      message:  'Are you sure you want to delete this employee?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.empService.deleteEmployee(this.selectedEmployee.id).subscribe({
          next: (data: Message) => {
            if (data.message.toLowerCase().indexOf('delete') > 0) {
              let pos = -1;
              if (this.site && this.site.employees) {
                for (let i=0; i < this.site.employees.length && pos < 0; i++) {
                  if (this.site.employees[i].id === this.selectedEmployee.id) {
                    pos = i;
                  }
                }
                if (pos >= 0) {
                  this.site.employees.splice(pos, 1);
                }
              }
              this.siteService.setSite(this.site);
              this.setEmployees();
            }
          },
          error: (err: Message) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.message;
          }
        });
      }
    })
  }

  optionClass(id: string): string {
    let answer = '';
    const now = new Date();
    this.siteEmployees.forEach(emp => {
      if (emp.id === id) {
        if (emp.user && emp.user.passwordExpires.getTime() < now.getTime()) {
          answer = 'expired';
        } else if (emp.user && emp.user.badAttempts > 2) {
          answer = 'locked';
        }
      }
    });
    return answer;
  }

  setMaxWidth(): string {
    let width = window.innerWidth - 570;
    return `max-width: ${width}px;`;
  }
  
  setEditorWidth(): string {
    let width = window.innerWidth - 755;
    this.maxWidth = width - 50;
    return `max-width: ${width}px;`;
  }

  employeeClass(empID: string): string {
    let answer = "item ";
    if (this.selectedEmployee.id === empID) {
      answer += "selected";
    } else {
      this.siteEmployees.forEach(emp => {
        if (emp.id === empID) {
          if (emp.user && emp.user.isExpired()) {
            answer += "expired";
          } else if (emp.user && emp.user.isLocked()) {
            answer += "locked";
          } else {
            answer += "unselected";
          }
        }
      })
      if (answer === "item ") {
        answer += "unselected";
      }
    }
    return answer;
  }
}
