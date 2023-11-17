import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { Employee } from 'src/app/models/employees/employee';
import { ISite, Site } from 'src/app/models/sites/site';
import { Message } from 'src/app/models/web/employeeWeb';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';

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
  employeeSelectionForm: FormGroup;
  selectedEmployee: Employee = new Employee();
  siteEmployees: Employee[] = [];
  activeOnly: boolean = true;

  constructor(
    protected empService: EmployeeService,
    protected siteService: SiteService,
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
    this.selectEmployee();
  }

  setEmployees(): void {
    this.siteEmployees = [];
    const active = this.employeeSelectionForm.value.activeOnly;
    if (this.site && this.site.employees) {
      this.site.employees.forEach(iEmp => {
        const emp = new Employee(iEmp);
        if ((active && emp.isActive()) || !active) {
          this.siteEmployees.push(emp);
        }
      });
      this.siteEmployees.sort((a,b) => a.compareTo(b));
    }
  }

  selectEmployee(): void {
    const empID: string = this.employeeSelectionForm.value.employee;
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
    const employee = this.empService.getEmployee();
    const site = this.siteService.getSite();
    if (employee && employee.id === emp.id) {
      this.empService.setEmployee(emp);
    }
    if (this.site && this.site.employees) {
      let found = false;
      for (let i=0; i < this.site.employees.length && !found; i++) {
        if (this.site.employees[i].id === emp.id) {
          this.site.employees[i] = new Employee(emp);
          found = true;
        }
      }
      if (site && site.id === this.site.id) {
        this.siteService.setSite(this.site);
      }
    }
    this.selectedEmployee = new Employee(emp);
    this.setEmployees();
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
}
