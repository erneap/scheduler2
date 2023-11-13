import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Assignment, Schedule } from 'src/app/models/employees/assignments';
import { Employee, EmployeeLaborCode } from 'src/app/models/employees/employee';
import { MustMatchValidator } from 'src/app/models/employees/must-match-validator.directive';
import { PasswordStrengthValidator } from 'src/app/models/employees/password-strength-validator.directive';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { Company } from 'src/app/models/teams/company';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { ISite, Site } from 'src/app/models/sites/site';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AnnualLeave } from 'src/app/models/employees/leave';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { showError: true },
    },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true}},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class NewEmployeeComponent {
  userForm: FormGroup;
  passwordForm: FormGroup;
  companyForm: FormGroup;
  laborForm: FormGroup;
  assignmentForm: FormGroup;
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }

  @Output() changed = new EventEmitter<Employee>();
  companies: Company[] = [];
  laborcodes: EmployeeLaborCode[] = [];
  workcenters: Workcenter[] = [];
  schedule: Schedule;
  teamid: string = '';
  employee: Employee;

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
    this.employee = new Employee();
    const asgmt = new Assignment();
    asgmt.id = 1;
    asgmt.startDate = new Date();
    asgmt.endDate = new Date(9999, 12, 30);
    if (asgmt.schedules.length === 0) {
      const sched = new Schedule();
      if (sched.workdays.length === 0) {
        sched.setScheduleDays(7);
      }
      asgmt.schedules.push(sched);
    }
    this.employee.assignments.push(asgmt);
    this.schedule = this.employee.assignments[0].schedules[0];
  }

  setup() {
    if (this.site.id === '') {
      const site = this.siteService.getSite();
      if (site) {
        this.site = site;
      }
    }
    this.workcenters = [];
    this.laborcodes = [];
    this.companies = [];
    const now = new Date();
    const team = this.teamService.getTeam();
    if (team && team.companies) {
      team.companies.forEach(co => {
        this.companies.push(new Company(co));
      })
    }
    this.companies.sort((a,b) => a.compareTo(b));
    if (this.site.forecasts) {
      this.site.forecasts.forEach(rpt => {
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
    if (this.site.workcenters) {
      this.site.workcenters.forEach(wc => {
        this.workcenters.push(new Workcenter(wc));
      });
    }
    this.laborcodes.sort((a,b) => a.compareTo(b));
    this.workcenters.sort((a,b) => a.compareTo(b));
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

  changeAssignmentSchedule(data: string) {
    if (typeof data === "string") {
      const chgParts = data.split('|');
      const field = chgParts[3];
      if (chgParts[0].toLowerCase() === 'workday') {
        if (chgParts[2] !== '') {
          const workday = Number(chgParts[2]);
          let found = false;
          for (let i=0; 
            i < this.employee.assignments[0].schedules[0].workdays.length 
            && !found; i++) {
            const wd = this.employee.assignments[0].schedules[0].workdays[i];
            if (wd.id === workday) {
              switch (field.toLowerCase()) {
                case "code":
                  wd.code = chgParts[4];
                  break;
                case "workcenter":
                  wd.workcenter = chgParts[4];
                  break;
                case "hours":
                  const hrs = Number(chgParts[4]);
                  wd.hours = hrs;
                  break;
              }
              found = true;
              this.employee.assignments[0].schedules[0].workdays[i] = wd;
            }
          }
        }
      } else {
        if (field.toLowerCase() === 'changeschedule') {
          const days = Number(chgParts[4]);
          this.schedule.setScheduleDays(days);
          this.schedule = new Schedule(this.schedule);
        }
      }
    }
  }

  addEmployee() {
    if (this.userForm.valid && this.passwordForm.valid && this.companyForm.valid
      && this.laborForm.valid && this.assignmentForm.valid) {
      this.employee.team = this.teamid;
      this.employee.site = this.site.id;
      this.employee.name.first = this.userForm.value.first;
      this.employee.name.middle = this.userForm.value.middle;
      this.employee.name.last = this.userForm.value.last;
      this.employee.email = this.userForm.value.email;
      const passwd = this.passwordForm.value.password;
      this.employee.companyinfo.company = this.companyForm.value.company;
      this.employee.companyinfo.employeeid 
        = this.companyForm.value.employeeid;
      this.employee.companyinfo.alternateid 
        = this.companyForm.value.alternateid;
      this.employee.companyinfo.jobtitle = this.companyForm.value.jobtitle;
      this.employee.companyinfo.rank = this.companyForm.value.rank;
      this.employee.companyinfo.costcenter = this.companyForm.value.costcenter;
      this.employee.companyinfo.division = this.companyForm.value.division;
      const labor: string = this.laborForm.value.laborcode;
      const laborParts = labor.split("|");
      const laborcode = new EmployeeLaborCode({
        chargeNumber: laborParts[0],
        extension: laborParts[1],
      });
      this.employee.assignments[0].site = this.site.id;  
      this.employee.assignments[0].workcenter = this.assignmentForm.value.workcenter;
      const start:Date = new Date(this.assignmentForm.value.startdate);
      this.employee.assignments[0].startDate = new Date(Date.UTC(start.getFullYear(),
        start.getMonth(), start.getDate()));
      this.employee.assignments[0].endDate = new Date(Date.UTC(9999, 11, 30));
      this.employee.assignments[0].schedules[0] = this.schedule;
      if (this.employee.assignments[0].laborcodes.length === 0) {
        this.employee.assignments[0].laborcodes.push(laborcode);
      } else {
        this.employee.assignments[0].laborcodes[0] = laborcode;
      }
      const balance = new AnnualLeave({
        year: (new Date()).getFullYear(),
        annual: 120.0,
        carryover: 0.0
      });
      this.employee.balance.push(balance);

      this.dialogService.showSpinner();
      this.authService.statusMessage = "Creating New Employee";
      this.empService.addEmployee(this.employee, passwd, this.teamid, 
        this.site.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = new Employee(data.employee);
              this.changed.emit(this.employee);
            }
          }
          this.authService.statusMessage = "Employee Created";
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }
}
