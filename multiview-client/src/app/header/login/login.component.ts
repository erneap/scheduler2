import { Component } from '@angular/core';
import { AuthenticationResponse, InitialResponse } from 'src/app/models/web/employeeWeb';
import { NotificationResponse } from 'src/app/models/web/internalWeb';
import { PtoHolidayBelowDialogComponent } from '../pto-holiday-below-dialog/pto-holiday-below-dialog.component';
import { Team } from 'src/app/models/teams/team';
import { Site } from 'src/app/models/sites/site';
import { Employee } from 'src/app/models/employees/employee';
import { PasswordExpireDialogComponent } from '../password-expire-dialog/password-expire-dialog.component';
import { User } from 'src/app/models/users/user';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { IpService } from 'src/app/services/ip-service.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TeamService } from 'src/app/services/team.service';
import { SiteService } from 'src/app/services/site.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { AuthService } from 'src/app/services/auth.service';
import { WaitDialogComponent } from '../wait-dialog/wait-dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  loginError: string = '';
  matDialogRef?: MatDialogRef<WaitDialogComponent> = undefined
  ipAddress: string = "";

  constructor(
    public authService: AuthService,
    protected employeeService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    private formBuilder: FormBuilder,
    private router: Router,
    public dialog: MatDialog,
    private dialogService: DialogService,
    protected ipService: IpService,
    protected msgService: MessageService
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
      ]],
    });
    const user = this.authService.getUser();
    if (user) {
      this.authService.isAuthenticated = true;
      this.getInitialData(user.id)
    }
  }

  ngOnInit() {
    this.buildLoginForm();
  }

  buildLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(30),
      ]],
    });
  }

  login() {
    this.authService.clearToken();
    let data = { emailAddress: this.loginForm.value.email,
      password: this.loginForm.value.password };
    this.dialogService.showSpinner();
    this.authService.loginError = "";
    
    this.authService.statusMessage = "User Login in Progress";
    this.authService.login(data.emailAddress, data.password).subscribe({
      next: (data: AuthenticationResponse) => {
        this.dialogService.closeSpinner();
        this.authService.isAuthenticated = true;
        let id = '';
        if (data.user) {
          const user = new User(data.user);
          id = user.id;
          this.authService.setUser(user);
          const expiresIn = Math.floor((user.passwordExpires.getTime() - (new Date).getTime())/(24 * 3600000));
          if (expiresIn <= 10) {
            const dialogRef = this.dialog.open(PasswordExpireDialogComponent, {
              width: '250px',
              data: { days: expiresIn },
            });
          }
        }
        if (data.token) {
          this.authService.setToken(data.token);
        }
        if (!data.exception || data.exception === '') {
          this.authService.isAuthenticated = true;
          this.authService.startTokenRenewal();
          this.msgService.startAlerts();
          this.authService.statusMessage = "User Login Complete";
          this.getInitialData(id);
        } else {
          this.loginError = data.exception;
          this.authService.isAuthenticated = false;
        }
      },
      error: (err: AuthenticationResponse) => {
        console.log(err);
        this.dialogService.closeSpinner();
        this.loginError = err.exception
        this.authService.statusMessage = err.exception;
        this.authService.isAuthenticated = false;
      }
    });
  }

  getInitialData(id: string) {
    this.authService.statusMessage = "Pulling Initial Data";
    this.dialogService.showSpinner();
    this.authService.initialData(id).subscribe({
      next: (data: InitialResponse) => {
        this.dialogService.closeSpinner();
        let leaveBalance: number = 0;
        let holidayBalance: number = 0;
        let ptoHours: number = 0;
        let holidayHours: number = 0;
        const now = new Date();
        let emp: Employee | undefined = undefined;
        let site = "";
        let team = "Scheduler";
        if (data.employee) {
          this.employeeService.setEmployee(data.employee)
          emp = new Employee(data.employee);
          emp.leaves.forEach(lv => {
            if (lv.leavedate.getFullYear() === now.getFullYear()) {
              switch (lv.code.toLowerCase()) {
                case "v":
                  ptoHours += lv.hours;
                  break;
                case "h":
                  holidayHours += lv.hours;
                  break;
              }
            }
          });
          emp.balance.forEach(bal => {
            if (bal.year === now.getFullYear()) {
              leaveBalance = bal.annual + bal.carryover;
            }
          });
        }
        if (data.site) {
          const oSite = new Site(data.site);
          this.siteService.setSite(oSite);
          site = oSite.name;
        }
        if (data.team) {
          const oTeam = new Team(data.team);
          team = oTeam.name;
          this.teamService.setTeam(oTeam);
          if (emp) {
            oTeam.companies.forEach(co => {
              if (emp?.companyinfo.company === co.id) {
                holidayBalance = 8.0 * co.holidays.length;
              }
            });
          }
        }
        let holPct = 0.0;
        if (holidayBalance > 0.0) {
          holPct = (holidayHours / holidayBalance ) * 100.0;
        }
        let ptoPct = 0.0;
        if (leaveBalance > 0.0) {
          ptoPct = (ptoHours / leaveBalance ) * 100.0;
        }
        if ((holPct > 0.0 && holPct < 80.0) 
          || (ptoPct > 0.0 && ptoPct < 80.0)) {
            const dialogRef = this.dialog.open(PtoHolidayBelowDialogComponent, {
              width: '400px',
              data: { 
                ptoHours: ptoHours,
                holidayHours: holidayHours,
                totalPTO: leaveBalance,
                totalHoliday: holidayBalance,
              },
            });
        }
        this.authService.setWebLabel(team, site);
        this.employeeService.startRenewal();
        this.siteService.startAutoUpdates();
        this.getInitialNotifications(id);
      },
      error: (err: InitialResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = `Problem getting initial data: ${err.exception}`;
      }
    })
  }

  getInitialNotifications(id: string) {
    this.authService.statusMessage = "Checking for notifications";
    this.dialogService.showSpinner()
    this.msgService.getEmployeeMessages(id).subscribe({
      next: (data: NotificationResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = "Initial Notifications reviewed";
        this.msgService.startAlerts();
        if (data && data !== null) {
          if (this.msgService.showAlerts) {
            this.router.navigateByUrl('/notifications');
          } else {
            this.router.navigateByUrl('/employee/schedule');
          }
        }
      },
      error: (err: NotificationResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = `Problem getting notification data: `
          + `${err.exception}`;
      }
    })
  }

  startForgot() {
    this.router.navigateByUrl('/reset/start');
  }
}
