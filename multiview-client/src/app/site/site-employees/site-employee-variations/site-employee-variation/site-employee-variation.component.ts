import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { IVariation, Schedule, Variation } from 'src/app/models/employees/assignments';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ISite, Site } from 'src/app/models/sites/site';
import { ChangeAssignmentRequest, EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-site-employee-variation',
  templateUrl: './site-employee-variation.component.html',
  styleUrls: ['./site-employee-variation.component.scss'],
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
export class SiteEmployeeVariationComponent {
  private _variation: Variation = new Variation();
  @Input()
  public set variation(vari: IVariation) {
    this._variation = new Variation(vari);
    this.setVariation();
  }
  get variation(): Variation {
    return this._variation;
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
  }
  get site(): Site {
    return this._site;
  }
  @Output() changed = new EventEmitter<Employee>();
  @Output() changeType = new EventEmitter<string>();
  variationForm: FormGroup;
  schedule: Schedule;
  showDates: boolean = true;

  constructor(
    protected empService: EmployeeService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.variationForm = this.fb.group({
      start: [new Date(), [Validators.required]],
      end: [new Date(), [Validators.required]],
      mids: false,
      dates: false,
    });
    this.schedule = new Schedule();
    this.schedule.setScheduleDays(7);
  }

  setVariation() {
    this.variationForm.controls['start'].setValue(this.variation.startdate);
    this.variationForm.controls['end'].setValue(this.variation.enddate)
    this.variationForm.controls['mids'].setValue(this.variation.mids);
    this.schedule = this.variation.schedule;
    this.variationForm.controls['dates'].setValue(this.schedule.showdates);

  }

  setVariationEnd() {
    const sDate = new Date(this.variationForm.value.start);
    const eDate = new Date(this.variation.enddate);
    if (eDate.getTime() < sDate.getTime()) {
      this.variationForm.controls['end'].setValue(sDate);
    }
  }
  
  updateSchedule(data: string) {
    if (typeof(data) === 'string') {
      const chgParts = data.split("|");
      let bWorkdays = false;
      let variationID = this.variation.id;
      console.log(data);

      if (this.variation.id > 0) {
        const change: ChangeAssignmentRequest = {
          employee: this.employee.id,
          asgmt: this.variation.id,
          schedule: 0,
          field: chgParts[3],
          value: chgParts[4],
        }
        this.dialogService.showSpinner();
        if (chgParts[0].toLowerCase() === 'schedule') {
          this.authService.statusMessage = `Updating Employee Variation -`
            + `Schedule Days`;
        } else {
          bWorkdays = true;
          change.workday = Number(chgParts[2]);
          this.authService.statusMessage = `Updating Employee Variation -`
            + `Schedule Workday`;
        }
        this.empService.updateVariation(change, bWorkdays)
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
              this.authService.statusMessage = "Update complete";
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
        
      } else {
        // a new variation which will be added in its entirity.
        if (chgParts[0].toLowerCase() === 'schedule') {
          // the only schedule action available is to increase or decrease the
          // number of days in the variation's schedule
          this.variation.schedule.setScheduleDays(Number(chgParts[4]));
          this.schedule = new Schedule(this.variation.schedule);
        } else {
          // this indicates a change in a workday value.  
          const day = Number(chgParts[2]);
          this.variation.schedule.workdays.forEach(wd => {
            if (wd.id === day) {
              switch (chgParts[3].toLowerCase()) {
                case "code":
                  wd.code = chgParts[4];
                  break;
                case "workcenter":
                  wd.workcenter = chgParts[4];
                  break;
                case "hours":
                  wd.hours = Number(chgParts[4]);
                  break;
              }
            }
          });
        }
      } 
    }
  } 

  addVariation() {
    this.variation.site = this.site.id;
    this.variation.id = 0;
    this.variation.mids = this.variationForm.value.mids;
    let sDate = new Date(this.variationForm.value.start);
    let eDate = new Date(this.variationForm.value.end);
    this.variation.startdate = sDate;
    this.variation.enddate = eDate;
    this.variation.schedule.showdates = this.variationForm.value.dates;
    this.authService.statusMessage = "Adding New Variation";
    this.dialogService.showSpinner();
    this.empService.addVariation(this.employee.id, this.variation)
    .subscribe({
      next: (data: EmployeeResponse) => {
        this.dialogService.closeSpinner();
        if (data && data !== null) {
          if (data.employee) {
            this.employee = new Employee(data.employee);
            this.empService.replaceEmployee(data.employee);
            this.changed.emit(this.employee);
            this.changeType.emit('add');
          }
        }
        this.authService.statusMessage = "Add complete";
      },
      error: (err: EmployeeResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    });
  }

  updateVariation(field: string) {
    if (field.toLowerCase() === 'start') {
      this.setVariationEnd();
    }
    let variationID = this.variation.id;

    if (this.variation.id > 0) {
      let empID = '';
      const data: ChangeAssignmentRequest = {
        employee: this.employee.id,
        asgmt: this.variation.id,
        field: field,
        value: '',
      };
      switch (field.toLowerCase()) {
        case "start":
          data.value = this.getYearFirstDate(new Date(this.variationForm.value.start));
          break;
        case "end":
          data.value = this.getYearFirstDate(new Date(this.variationForm.value.end));
          break;
        case "mids":
          data.value = (this.variationForm.value.mids) ? 'true' : 'false';
          break;
        case "dates":
          data.value = (this.variationForm.value.dates) ? 'true' : 'false';
          break;
      }
      this.authService.statusMessage = "Updating Variation";
      this.dialogService.showSpinner();
      this.empService.updateVariation(data, false)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee) {
                this.employee = new Employee(data.employee);
                this.empService.replaceEmployee(data.employee);
                let max = 0;
                this.employee.variations.forEach(v => {
                  if (v.id === variationID) {
                    this.variation = new Variation(v);
                  }
                });
                this.setVariation();
              }
              const emp = this.empService.getEmployee();
              if (data.employee && emp && emp.id === data.employee.id) {
                this.empService.setEmployee(data.employee);
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
    } else {
      switch (field.toLowerCase()) {
        case "start":
          this.variation.startdate = new Date(this.variationForm.value.start);
          break;
        case "end":
          this.variation.enddate = new Date(this.variationForm.value.end);
          break;
        case "mids":
          this.variation.mids = this.variationForm.value.mids;
          for (let i=1; i < this.variation.schedule.workdays.length; i++) {
            this.variation.schedule.workdays[i].code = 'M';
            this.variation.schedule.workdays[i].hours = 8.0;
          }
          break;
        case "dates":
          this.variation.schedule.showdates = this.variationForm.value.dates;
          let start = new Date(this.variationForm.value.start);
          while (start.getDay() !== 0) {
            start = new Date(start.getTime() - (24 * 3600000));
          }
          let end = new Date(this.variationForm.value.end);
          while (end.getDay() !== 6) {
            end = new Date(end.getTime() + (24 * 3600000));
          }
          const days = Math.floor((end.getTime() - start.getTime()) / (24 * 3600000)) + 1;
          this.variation.schedule.setScheduleDays(days);
          break;
      }
      this.schedule = new Schedule(this.variation.schedule);
    }
    if (field.toLowerCase() === 'mids') {
      
    } else if (field.toLowerCase() === 'dates') {
      if (this.variationForm.value.dates) {
        
        this.schedule = new Schedule(this.variation.schedule);
      }
    }
  }

  getYearFirstDate(date: Date): string {
    date = new Date(date);
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
}
