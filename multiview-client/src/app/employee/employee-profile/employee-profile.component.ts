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

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent {
  private _employee: Employee | undefined;
  @Input()
  public set employee(iEmp: IEmployee) {
    this._employee = new Employee(iEmp);
    this.setForm();
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
  @Output() changed = new EventEmitter<Employee>();

  profileForm: FormGroup;
  formError: string = '';
  showPassword: boolean = true;

  constructor(
    protected authService: AuthService,
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected dialogService: DialogService,
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
                const iEmp = this.empService.getEmployee();
                if (iEmp && iEmp.id === data.employee.id) {
                  this.empService.setEmployee(new Employee(data.employee));
                }
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
              const emp = this.empService.getEmployee();
              if (emp && emp.id === data.employee.id) {
                this.empService.setEmployee(data.employee);
              }
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
