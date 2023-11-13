import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Schedule } from 'src/app/models/employees/assignments';
import { Employee, EmployeeLaborCode } from 'src/app/models/employees/employee';
import { MustMatchValidator } from 'src/app/models/employees/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/employees/password-strength-validator.directive';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { Company } from 'src/app/models/teams/company';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { Site } from 'src/app/models/sites/site';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteResponse } from 'src/app/models/web/siteWeb';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
  ],
})
export class NewEmployeeComponent {
  @Input() siteid
  userForm: FormGroup;
  passwordForm: FormGroup;
  companyForm: FormGroup;
  laborForm: FormGroup;
  assignmentForm: FormGroup;

  @Output() changed = new EventEmitter<Employee>();
  companies: Company[] = [];
  laborcodes: EmployeeLaborCode[] = [];
  workcenters: Workcenter[] = [];
  schedule: Schedule;
  teamid: string = '';

  constructor(
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private formBuilder: FormBuilder
  ) {
    this.userForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      first: ['', [Validators.required]],
      middle: '',
      last: ['', [Validators.required]],
    });
    this.passwordForm = this.formBuilder.group({
      password: ['', [Validators.required, new PasswordStrengthValidator()]],
      password2: ['', [Validators.required, new MustMatchValidator()]],
    });
    this.companyForm = this.formBuilder.group({
      company: ['', [Validators.required]],
      employeeid: ['', [Validators.required]],
      alternateid: '',
      jobtitle: ['', [Validators.required]],
      rank: '',
      costcenter: '',
      division: '',
    });
    this.laborForm = this.formBuilder.group({
      laborcode: ['',[Validators.required]],
    });
    this.assignmentForm = this.formBuilder.group({
      workcenter: '',
      startdate: new Date(),
    });
    this.setup();
    this.schedule = new Schedule();
    this.schedule.setScheduleDays(7);
  }

  setup() {
    if (this.siteid === '') {
      const site = this.siteService.getSite();
      if (site) {
        this.siteid = site.id;
      }
    }
    const now = new Date();
    const team = this.teamService.getTeam();
    if (team) {
      var site: Site | undefined;
      this.siteService.retrieveSite(team.id, this.siteid, true).subscribe({
        next: (resp: SiteResponse) => {

        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = `New Employee: Setup: ${err.exception}`;
        }
      })
      this.laborcodes = [];
      this.workcenters = [];
      if (site) {
        this.siteid = site.id;
        if (site.forecasts) {
          site.forecasts.forEach(rpt => {
            if (rpt.startDate.getTime() <= now.getTime() 
              && rpt.endDate.getTime() >= now.getTime()
              && rpt.laborCodes) {
              rpt.laborCodes.forEach(lc => {
                if (!lc.exercise) {
                  const labor = new EmployeeLaborCode();
                  labor.chargeNumber = lc.chargeNumber;
                  labor.extension = lc.extension;
                  this.laborcodes.push(labor)
                }
              });
            }
          });
        }
        if (site.workcenters) {
          site.workcenters.forEach(wc => {
            this.workcenters.push(new Workcenter(wc));
          });
        }
      }
      this.laborcodes.sort((a,b) => a.compareTo(b));
      this.workcenters.sort((a,b) => a.compareTo(b));
    }
    this.schedule = new Schedule();
    this.schedule.setScheduleDays(7);
  }
  
  getPasswordError(): string {
    let answer: string = ''
    if (this.passwordForm.get('password')?.hasError('required')) {
      answer = "Required";
    }
    if (this.passwordForm.get('password')?.hasError('passwordStrength')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Doesn't meet minimum req.";
    }
    return answer;
  }

  getVerifyError(): string {
    let answer: string = ''
    if (this.passwordForm.get('password2')?.hasError('required')) {
      answer = "Required";
    }
    if (this.passwordForm.get('password2')?.hasError('matching')) {
      if (answer !== '') {
        answer += ', ';
      }
      answer += "Passwords don't match";
    }
    return answer;
  }
}
