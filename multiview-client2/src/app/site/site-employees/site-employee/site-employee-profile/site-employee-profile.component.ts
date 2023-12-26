import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { MustMatchValidator } from 'src/app/models/employees/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/employees/password-strength-validator.directive';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { SiteEmployeeProfileUserAccountDialogComponent } from './site-employee-profile-user-account-dialog/site-employee-profile-user-account-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';

@Component({
  selector: 'app-site-employee-profile',
  templateUrl: './site-employee-profile.component.html',
  styleUrls: ['./site-employee-profile.component.scss']
})
export class SiteEmployeeProfileComponent {
  private _employee: Employee = new Employee();
  @Input()
  public set employee(iEmp: IEmployee) {
    this._employee = new Employee(iEmp);
    this.setForm();
  }
  get employee(): Employee {
    return this._employee;
  }
  @Input() maxWidth: number = window.innerWidth - 500;
  @Output() changed = new EventEmitter<Employee>();
  permissions: string[] = ['employee', 'scheduler', 'company', 'siteleader'];
  permNames: string[] = ['Employee', 'Site Scheduler', 'Site Company Leader',
    'Site Leader']
  profileForm: FormGroup;
  emailForm: FormGroup;
  formError: string = '';
  showPassword: boolean = true;
  selectedEmail: string = '';

  constructor(
    protected authService: AuthService,
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private fb: FormBuilder
  ) {
    this.profileForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      first: ['', [Validators.required]],
      middle: '',
      last: ['', [Validators.required]],
      password: ['', [new PasswordStrengthValidator()]],
      password2: ['', [new MustMatchValidator()]],
    });
    this.emailForm = fb.group({
      editor: ['', [Validators.email]],
    })
    const iEmp = this.empService.getEmployee();
    if (iEmp) {
      this.employee = iEmp;
    }
    this.setForm();
  }

  setForm() {
    if (this.employee.user) {
      this.showPassword = true;
      this.profileForm.controls["email"].setValue(this.employee.user.emailAddress);
    } else {
      this.showPassword = false;
      this.profileForm.controls["email"].setValue('');
    }
    this.profileForm.controls["first"].setValue(this.employee.name.first);
    this.profileForm.controls["middle"].setValue(this.employee.name.middle);
    this.profileForm.controls["last"].setValue(this.employee.name.last);
    this.profileForm.controls["password"].setValue('');
    this.profileForm.controls["password2"].setValue('');
  }

  getPasswordError(): string {
    let answer: string = ''
    if (this.profileForm.get('password')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.profileForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't meet minimum requirements";
    }
    return answer;
  }

  getVerifyError(): string {
    let answer: string = ''
    if (this.profileForm.get('password2')?.hasError('required')) {
      answer = "Password is Required";
    }
    if (this.profileForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Password doesn't match";
    }
    return answer;
  }

  setPassword() {
    if (this.profileForm.valid) {
      let id = "";
      if (this.employee && this.employee.id !== "") {
        id = this.employee.id;
      } else {
        const user = this.authService.getUser();
        id = (user && user.id) ? user.id : '';
      }
    
      const passwd = this.profileForm.value.password;
      this.dialogService.showSpinner();
      this.authService.statusMessage = "Updating User Password";
      this.authService.changePassword(id, passwd)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              this.formError = data.exception;
              if (data.exception === '') {
                this.profileForm.controls['password'].setValue(undefined);
                this.profileForm.controls['password2'].setValue(undefined);
              }
              if (data.employee && data.employee !== null) {
                this.empService.replaceEmployee(data.employee);
                this.changed.emit(new Employee(data.employee));
              }
            }
            this.authService.statusMessage = "Update complete";
          },
          error: (error: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = error.exception;
          }
        });
    }
  }

  updateUserField(field: string) {
    let value: string = '';
    let id = "";
    if (this.employee && this.employee.id !== "") {
      id = this.employee.id;
    } else {
      const user = this.authService.getUser();
      id = (user && user.id) ? user.id : '';
    }
    switch(field.toLowerCase()) {
      case "email":
        value = this.profileForm.value.email;
        break;
      case "first":
        value = this.profileForm.value.first;
        break;
      case "middle":
        value = this.profileForm.value.middle;
        break;
      case "last":
        value = this.profileForm.value.last;
        break;
    }
    this.dialogService.showSpinner();
    this.authService.statusMessage = `Updating User's ${field.toUpperCase()}`;
    this.empService.updateEmployee(id, field, value)
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.empService.replaceEmployee(data.employee)
            }
          }
          this.changed.emit(new Employee(this.employee));
          this.authService.statusMessage = "Update complete"; 
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
  }

  hasPermission(perm: string): boolean {
    if (this.employee.user) {
      const fullperm = `scheduler-${perm}`;
      let answer = false;
      this.employee.user.workgroups.forEach(wg => {
        if (wg.toLowerCase() === fullperm.toLowerCase()) {
          answer = true;
        }
      });
      return answer;
    }
    return false;
  }

  updatePermission(perm: string) {
    let field = '';
    if (!this.hasPermission(perm)) {
      field = 'addperm';
    } else {
      field = 'removeperm';
    }
    this.dialogService.showSpinner();
    this.empService.updateEmployee(this.employee.id, field, perm)
    .subscribe({
      next: (data: EmployeeResponse) => {
        this.dialogService.closeSpinner();
        if (data && data !== null && data.employee) {
          this.employee = data.employee;
          this.empService.replaceEmployee(this.employee)
          this.changed.emit(this.employee);
        }
      },
      error: (err: EmployeeResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    });
  }

  unlockUser() {
    this.dialogService.showSpinner();
    this.empService.updateEmployee(this.employee.id, 'unlock', '0')
    .subscribe({
      next: (data: EmployeeResponse) => {
        this.dialogService.closeSpinner();
        if (data && data !== null && data.employee) {
          this.employee = data.employee;
          this.empService.replaceEmployee(this.employee)
          this.changed.emit(this.employee);
        }
      },
      error: (err: EmployeeResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    });
  }

  addUserAccount(): void {
    const dialogRef = this.dialog.open(SiteEmployeeProfileUserAccountDialogComponent, {
      data: {emailAddress: '', password: ''},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.data) {
        if (result.emailAddress !== '') {
          this.dialogService.showSpinner();
          this.empService.addUserAccount(this.employee.id, 
          result.emailAddress, result.password).subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null && data.employee) {
                this.employee = data.employee;
                this.empService.replaceEmployee(this.employee)
                this.changed.emit(this.employee);
              }
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
        }
      }
    })
  }

  setWidth(): string {
    return `width: ${this.maxWidth}px;`;
  }

  setEmailClass(email: string): string {
    let answer = 'item';
    if (email.toLowerCase() === this.selectedEmail.toLowerCase()) {
      answer += " selected";
    }
    return answer;
  }

  selectEmail(email: string) {
    if (email !== 'new') {
      this.selectedEmail = email;
      this.emailForm.controls['editor'].setValue(email);
    } else {
      this.selectedEmail = '';
      this.emailForm.controls['editor'].setValue('');
    }
  }

  updateEmail() {
    this.dialogService.showSpinner();
    const newEmail = this.emailForm.value.editor;
    if (this.selectedEmail === '') {
      this.empService.updateEmployee(this.employee.id, "addemail", newEmail)
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.empService.replaceEmployee(this.employee);
            }
          }
          this.changed.emit(new Employee(this.employee));
          this.emailForm.controls['editor'].setValue(newEmail);
          this.selectedEmail = newEmail;
          this.authService.statusMessage = "Update complete"; 
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    } else {
      this.empService.updateEmployeeEmail(this.employee.id, "updateemail", 
        this.selectedEmail, newEmail).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.empService.replaceEmployee(this.employee);
            }
          }
          this.changed.emit(new Employee(this.employee));
          this.authService.statusMessage = "Update complete"; 
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  deleteEmail() {
    if (this.selectedEmail !== '') {
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
        data: {title: 'Confirm Email Deletion',
        message:  "Are you sure you want to delete this employee's email address?"},
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.dialogService.showSpinner();
          this.empService.updateEmployee(this.employee.id, "removeemail", 
            this.selectedEmail).subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee) {
                  this.employee = data.employee;
                  this.empService.replaceEmployee(this.employee);
                }
              }
              this.changed.emit(new Employee(this.employee));
              this.emailForm.controls['editor'].setValue('');
              this.selectedEmail = '';
              this.authService.statusMessage = "Update complete"; 
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
        }
      });
    }
  }
}
