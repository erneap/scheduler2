import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { Assignment, IAssignment, Schedule } from 'src/app/models/employees/assignments';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { LaborCharge } from 'src/app/models/sites/laborcode';
import { ISite, Site } from 'src/app/models/sites/site';
import { Team } from 'src/app/models/teams/team';
import { ChangeAssignmentRequest, EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-employee-assignment-edit',
  templateUrl: './site-employee-assignment-edit.component.html',
  styleUrls: ['./site-employee-assignment-edit.component.scss'],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true}},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class SiteEmployeeAssignmentEditComponent {
  private _assignment: Assignment = new Assignment();
  @Input() 
  public set assignment(asgmt: IAssignment) {
    this._assignment = new Assignment(asgmt);
    this.setAssignment();
  }
  get assignment(): Assignment {
    return this._assignment;
  }
  private _employee: Employee = new Employee();
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
  }
  get employee(): Employee {
    return this._employee;
  }
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
    this.asgmtForm.controls['site'].setValue(this.site.id);
    this.setAssignment();
  }
  get site(): Site {
    return this._site;
  }
  @Input() employeeid: string = '';
  @Output() changed = new EventEmitter<Employee>();
  team: Team = new Team();
  asgmtForm: FormGroup;
  scheduleForm: FormGroup;
  laborForm: FormGroup;
  selectedSite: Site | undefined;
  schedule: Schedule = new Schedule();
  laborcodes: LaborCharge[] = [];

  constructor(
    protected teamService: TeamService,
    protected empService: EmployeeService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    const team = this.teamService.getTeam();
    if (team) {
      this.team = new Team(team);
    }
    this.asgmtForm = this.fb.group({
      site: [this.site.id, [Validators.required]],
      workcenter: ['', [Validators.required]],
      startdate: [new Date(), [Validators.required]],
      enddate: [new Date(), [Validators.required]],
    });
    this.scheduleForm = this.fb.group({
      schedule: 0,
      rotationdate: new Date(),
      rotationdays: 28,
    });
    let labor: string[] = [];
    this.laborForm = this.fb.group({
      laborcodes: [labor, [Validators.required]],
    });
  }

  setAssignment(): void {
    this.setLaborCodes();
    this.asgmtForm.controls['site'].setValue(this.assignment.site);
    this.asgmtForm.controls['workcenter'].setValue(this.assignment.workcenter);
    this.asgmtForm.controls['startdate'].setValue(this.assignment.startDate);
    this.asgmtForm.controls['enddate'].setValue(this.assignment.endDate);
    this.schedule = this.assignment.schedules[0];
    this.scheduleForm.controls['schedule'].setValue(0);
    this.scheduleForm.controls['rotationdate']
      .setValue(this.assignment.rotationdate);
      this.scheduleForm.controls['rotationdays']
        .setValue(this.assignment.rotationdays);
    this.laborcodes.forEach(lc => {
      lc.checked = this.assignment.hasLaborCode(lc.chargenumber, lc.extension);
    });
    this.selectSite();
  }

  selectSite() {
    this.selectedSite = undefined;
    const siteid = this.asgmtForm.value.site;
    this.team.sites.forEach(s => {
      if (s.id === siteid) {
        this.selectedSite = new Site(s);
      }
    });
  }

  changeSchedule() {
    let schedID = Number(this.scheduleForm.value.schedule);
    this.assignment.schedules.forEach(sch => {
      if (sch.id === schedID) {
        this.schedule = new Schedule(sch);
      }
    });
  }

  getYearFirstDate(date: Date): string {
    let answer =  `${date.getFullYear()}-`;
    if (date.getMonth() + 1 < 10) {
      answer += '0';
    }
    answer += `${date.getMonth() + 1}-`;
    if (date.getDate() < 10) {
      answer += '0';
    }
    answer += `${date.getDate()}`;
    return answer;
  }

  updateField(field: string) {
    let asgmtid = Number(this.asgmtForm.value.assignment);
    if (asgmtid > 0) {
      var value: any;
      switch (field.toLowerCase()) {
        case "site":
          value = this.asgmtForm.value.site;
          break;
        case "workcenter":
          value = this.asgmtForm.value.workcenter;
          break;
        case "startdate":
          value = this.getYearFirstDate(this.asgmtForm.value.startdate);
          break;
        case "enddate":
          value = this.getYearFirstDate(this.asgmtForm.value.enddate);
          break;
        case "addschedule":
          value = '7';
          break;
        case "rotationdate":
          value = this.getYearFirstDate(this.asgmtForm.value.rotationdate);
          break;
        case "rotationdays":
          value = `${this.asgmtForm.value.rotationdays}`;
          break;
      }
      this.dialogService.showSpinner();
      this.authService.statusMessage = `Updating Employee Assignment -`
        + `${field.toUpperCase()}`;
      this.empService.updateAssignment(this.employee.id, asgmtid, field, value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            let schID = this.schedule.id;
            if (data && data !== null) {
              if (data.employee) {
                const employee: Employee = new Employee(data.employee);
                this.empService.replaceEmployee(data.employee);
                this.changed.emit(employee);
              }
            }
            this.authService.statusMessage = "Update complete";
          },
          error: (err: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        })
    }
  }

  updateSchedule(data: string) {
    if (typeof(data) === 'string') {
      const chgParts = data.split("|");
      const change: ChangeAssignmentRequest = {
        employee: this.employee.id,
        asgmt: this.assignment.id,
        schedule: Number(chgParts[1]),
        field: chgParts[3],
        value: chgParts[4],
      }
      let asgmtID = change.asgmt;
      let schID = change.schedule;
      
      if (chgParts[0].toLowerCase() === 'schedule') {
        if (change.field.toLowerCase() === 'removeschedule') {
          this.authService.statusMessage = "Removing Employee Assignment "
            + 'Schedule';
        } else {
          this.authService.statusMessage = `Updating Employee Assignment -`
            + `Schedule Days`;
        }
        this.dialogService.showSpinner();
        this.empService.updateAssignmentSchedule(change)
          .subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee) {
                  const employee: Employee = new Employee(data.employee);
                  this.empService.replaceEmployee(data.employee);
                  this.changed.emit(employee);
                }
              }
              this.authService.statusMessage = "Update complete";
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
      } else {
        change.workday = Number(chgParts[2]);
        this.dialogService.showSpinner();
        this.authService.statusMessage = `Updating Employee Assignment -`
          + `Schedule Days`;
        this.empService.updateAssignmentWorkday(change)
          .subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee) {
                  const employee: Employee = new Employee(data.employee);
                  this.empService.replaceEmployee(data.employee);
                  this.changed.emit(employee);
                }
              }
              this.authService.statusMessage = "Update complete";
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
      }
    }
  }

  addAssignment() {
    const wkctr = this.asgmtForm.value.workcenter;
    let start = new Date(this.asgmtForm.value.startdate);
    start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), 
      start.getDate(), 0, 0, 0, 0))
    let siteID = this.asgmtForm.value.site;
    let empID = this.employee.id;
    this.authService.statusMessage = 'Adding new assignment'
    this.empService.AddAssignment(empID, siteID, wkctr, start, 7)
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              const employee = new Employee(data.employee);
              this.empService.replaceEmployee(data.employee);
              this.changed.emit(employee);
            }
          }
          this.authService.statusMessage = "Update complete";
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
  }

  setLaborCodes() {
    this.laborcodes = [];
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 11, 31);
    if (this.site && this.site.forecasts) {
      this.site.forecasts.forEach(f => {
        if (f.endDate.getTime() >= start.getTime() && f.startDate.getTime() <= end.getTime()) {
          if (f.laborCodes) {
            f.laborCodes.forEach(lc => {
              const newLc: LaborCharge = {
                chargenumber: lc.chargeNumber,
                extension: lc.extension,
                checked: false,
              }
              this.laborcodes.push(newLc);
            });
          }
        }
      });
    }
    this.laborcodes.sort((a,b) => {
      if (a.chargenumber === b.chargenumber) {
        return (a.extension < b.extension) ? -1 : 1;
      }
      return (a.chargenumber < b.chargenumber) ? -1 : 1;
    })
  }
  
  onSelect(chgNo: string, ext: string, event: MatCheckboxChange) {
    if (event.checked) {
      this.empService.addLaborCode(this.employee.id, this.assignment.id, 
        chgNo, ext)
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = new Employee(data.employee);
              this.empService.replaceEmployee(data.employee);
              this.changed.emit(this.employee);
            }
          }
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    } else {
      this.empService.removeLaborCode(this.employee.id, this.assignment.id, 
        chgNo, ext)
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = new Employee(data.employee);
              this.empService.replaceEmployee(data.employee);
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
  }
}
