import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { Assignment } from 'src/app/models/employees/assignments';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ISite, Site } from 'src/app/models/sites/site';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-site-employee-assignment',
  templateUrl: './site-employee-assignment.component.html',
  styleUrls: ['./site-employee-assignment.component.scss']
})
export class SiteEmployeeAssignmentComponent {
  private _employee: Employee = new Employee();
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
    this.setAssignments();
  }
  get employee(): Employee {
    return this._employee;
  }
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  @Output() changed = new EventEmitter<Employee>();
  asgmtForm: FormGroup;
  assignments: Assignment[] = [];
  selectedAssignment: Assignment = new Assignment();

  constructor(
    protected empService: EmployeeService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    protected dialog: MatDialog,
    private fb: FormBuilder
  ) { 
    this.asgmtForm = this.fb.group({
      assignment: 0,
    });
  }

  setAssignments() {
    this.assignments = [];
    this.employee.assignments.forEach(asgmt => {
      this.assignments.push(new Assignment(asgmt));
    });
    this.assignments.sort((a,b) => b.compareTo(a));
    this.selectedAssignment = this.assignments[0];
    if (this.selectedAssignment) {
      this.asgmtForm.controls['assignment'].setValue(this.selectedAssignment.id);
    }
  }

  onSelect() {
    const asgmtID = this.asgmtForm.value.assignment;
    this.selectedAssignment = new Assignment();
    if (asgmtID > 0) {
      this.assignments.forEach(asgmt => {
        if (asgmt.id === asgmtID) {
          this.selectedAssignment = asgmt;
        }
      });
    } else {
      this.selectedAssignment.site = this.employee.site;
    }
  }

  updateEmployee(emp: Employee): void {
    this.employee = new Employee(emp);
    const employee = this.empService.getEmployee();
    if (employee && employee.id === emp.id) {
      this.empService.setEmployee(emp);
    }
    this.changed.emit(emp);
  }

  assignmentDates(asgmt: Assignment): string {
    const months: string[] = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    if (asgmt.endDate.getFullYear() < 9990) {
      return `${asgmt.startDate.getDate()} ${months[asgmt.startDate.getMonth()]}`
        + ` ${asgmt.startDate.getFullYear()} - ${asgmt.endDate.getDate()} `
        + `${months[asgmt.endDate.getMonth()]} ${asgmt.endDate.getFullYear()}`;
    } 
    return `${asgmt.startDate.getDate()} ${months[asgmt.startDate.getMonth()]}`
      + ` ${asgmt.startDate.getFullYear()} -`;
  }

  deleteAssignment() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Assignment Deletion', 
      message: 'Are you sure you want to delete this assignment?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.authService.statusMessage = "Deleting Employee Assignment";
        this.empService.deleteAssignment(this.employee.id, 
          this.selectedAssignment.id)
          .subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee) {
                  this.employee = new Employee(data.employee);
                  this.changed.emit(this.employee);
                }
              }
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
      }
    })
  }
}
