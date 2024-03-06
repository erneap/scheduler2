import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatchValidator } from 'src/app/models/employees/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/employees/password-strength-validator.directive';
import { Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { IUser } from 'src/app/models/users/user';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.scss']
})
export class AddSiteComponent {
  private _team: Team = new Team();
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>();
  siteForm: FormGroup;
  leadForm: FormGroup;
  schedulerForm: FormGroup;

  constructor(
    protected authService: AuthService,
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.siteForm = this.fb.group({
      id: ['', [Validators.required, Validators.pattern('^[a-z]*[0-9]*$')]],
      title: ['', [Validators.required]],
      mids: false,
      offset: 0.0,
    });
    this.leadForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first: ['', [Validators.required]],
      middle: '',
      last: ['', [Validators.required]],
      password: ['', [Validators.required, new PasswordStrengthValidator()]],
      password2: ['', [Validators.required, new MustMatchValidator()]]
    });
    this.schedulerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      first: ['', [Validators.required]],
      middle: '',
      last: ['', [Validators.required]],
      password: ['', [Validators.required, new PasswordStrengthValidator()]],
      password2: ['', [Validators.required, new MustMatchValidator()]]
    });
  }

  onAdd() {
    if (this.siteForm.valid && this.leadForm.valid) {
      const lead: IUser = {
        id: '',
        emailAddress: this.leadForm.value.email,
        firstName: this.leadForm.value.first,
        middleName: this.leadForm.value.middle,
        lastName: this.leadForm.value.last,
        password: this.leadForm.value.password,
        passwordExpires: new Date(),
        badAttempts: 0,
        workgroups: [],
      }
      let scheduler: IUser | undefined = undefined
      if (this.schedulerForm.valid) {
        scheduler = {
          id: '',
          emailAddress: this.schedulerForm.value.email,
          firstName: this.schedulerForm.value.first,
          middleName: this.schedulerForm.value.middle,
          lastName: this.schedulerForm.value.last,
          password: this.schedulerForm.value.password,
          passwordExpires: new Date(),
          badAttempts: 0,
          workgroups: [],
        }
      }
      this.dialogService.showSpinner();
      this.siteService.AddSite(this.team.id, this.siteForm.value.id,
        this.siteForm.value.title, this.siteForm.value.mids, 
        Number(this.siteForm.value.offset), lead, scheduler).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.site) {
            this.team.sites.push(new Site(data.site));
            this.changed.emit(this.team);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }
}
