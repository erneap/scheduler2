import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../models/users/user';
import { AuthenticationResponse, InitialResponse } from '../models/web/employeeWeb';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PasswordExpireDialogComponent } from './password-expire-dialog/password-expire-dialog.component';
import { WaitDialogComponent } from './wait-dialog/wait-dialog.component';
import { DialogService } from '../services/dialog-service.service';
import { IpService } from '../services/ip-service.service';
import { EmployeeService } from '../services/employee.service';
import { SiteService } from '../services/site.service';
import { TeamService } from '../services/team.service';
import { MessageService } from '../services/message.service';
import { NotificationResponse } from '../models/web/internalWeb';
import { Site } from '../models/sites/site';
import { Team } from '../models/teams/team';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
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
      console.log(`Initial User: ${user.lastName}`);
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
        let site = "";
        let team = "Scheduler";
        if (data.employee) {
          this.employeeService.setEmployee(data.employee)
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
        }
        this.authService.setWebLabel(team, site);
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
}
