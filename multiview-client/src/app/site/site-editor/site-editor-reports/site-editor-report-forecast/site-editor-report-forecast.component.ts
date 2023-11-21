import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { ForecastPeriod, ForecastReport } from 'src/app/models/sites/forecastreport';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-report-forecast',
  templateUrl: './site-editor-report-forecast.component.html',
  styleUrls: ['./site-editor-report-forecast.component.scss'],
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
export class SiteEditorReportForecastComponent {
  private _site: Site = new Site();
  @Input()
  public set site(site: ISite) {
    this._site = new Site(site);
    this.setReports();
  }
  get site(): Site {
    return this._site;
  }
  private _team: Team = new Team();
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Site>();
  currentReports: ForecastReport[] = [];
  selectedReport: ForecastReport = new ForecastReport();
  reportsForm: FormGroup;
  basicForm: FormGroup;
  periodForm: FormGroup;
  weekdays = [ 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
      'Friday', 'Saturday'];
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"];
  disableMoveFirst: boolean = true;
  disableMoveLast: boolean = true;

  constructor(
    protected siteService: SiteService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.reportsForm = this.fb.group({
      report: 0,
    });
    this.basicForm = this.fb.group({
      companyid: ['', [Validators.required]],
      name: ['', [Validators.required]],
      start: [new Date(), [Validators.required]],
      end: [new Date(), [Validators.required]],
      startday: [0, [Validators.required]],
    });
    this.periodForm = this.fb.group({
      period: 0,
    })
  }

  setReports() {
    this.currentReports = [];
    let now = new Date();
    now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    let monthPrior = new Date(now.getTime() - (30 * 24 * 3600000));  // up to one month prior
    this.site.forecasts.forEach(rpt => {
      if ((rpt.startDate.getTime() <= now.getTime() 
        && rpt.endDate.getTime() >= now.getTime())
        || (rpt.startDate.getTime() <= monthPrior.getTime() 
        && rpt.endDate.getTime() >= monthPrior.getTime())) {
        this.currentReports.push(new ForecastReport(rpt));
      }
    });
    this.currentReports.sort((a,b) => a.compareTo(b));
  }

  reportLabel(rpt: ForecastReport): string {
    const start = `${rpt.startDate.getDate()} `
      + `${this.months[rpt.startDate.getMonth()]} ${rpt.startDate.getFullYear()}`;
    const end = `${rpt.endDate.getDate()} `
      + `${this.months[rpt.endDate.getMonth()]} ${rpt.endDate.getFullYear()}`;
    return `(${rpt.companyid?.toUpperCase()}) ${rpt.name} (${start} - ${end})`;
  }

  onSelect() {
    const rptID = this.reportsForm.value.report;
    this.selectedReport = new ForecastReport();
    this.site.forecasts.forEach(rpt => {
      if (rptID === rpt.id) {
        this.selectedReport = new ForecastReport(rpt);
      }
    });
    let weekday = 0;
    if (this.selectedReport.periods && this.selectedReport.periods.length > 0) {
      const prd = this.selectedReport.periods[0];
      if (prd.periods && prd.periods.length > 0) {
        weekday = prd.periods[0].getDay();
      }
    }
    this.basicForm.controls['companyid'].setValue(this.selectedReport.companyid);
    this.basicForm.controls['name'].setValue(this.selectedReport.name);
    this.basicForm.controls['start'].setValue(this.selectedReport.startDate);
    this.basicForm.controls['end'].setValue(this.selectedReport.endDate);
    this.basicForm.controls['startday'].setValue(weekday);
  }

  periodLabel(prd: ForecastPeriod): string {
    let answer = `${this.months[prd.month.getMonth()]} `
      + `${prd.month.getFullYear()}:`;
    let comma = false;
    if (prd.periods && prd.periods.length > 0) {
      prd.periods.forEach(p => {
        if (comma) {
          answer += ", ";
        }
        answer += `${p.getMonth() + 1}/${p.getDate()}`;
        comma = true;
      })
    }
    return answer;
  }

  updateSite(site: Site) {
    this.site = new Site(site);
    this.changed.emit(this.site);
  }

  onChange(field: string): void {
    if (this.selectedReport.id > 0) {
      const value = this.basicForm.controls[field].value;
      if (value !== null) {
        let outputValue = '';
        if (field === 'start' || field === 'end') {
          outputValue = this.getDateString(value);
        } else {
          outputValue = value;
        }
        this.authService.statusMessage = "Updating Forecast Report";
        this.dialogService.showSpinner();
        this.siteService.updateForecastReport(this.team.id, this.site.id, 
          this.selectedReport.id, field, outputValue).subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.site) {
              this.site = new Site(data.site);
              this.changed.emit(this.site);
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

  onAdd() {
    if (this.basicForm.valid) {
      const name = this.basicForm.value.name;
      const start = this.basicForm.value.start;
      const end = this.basicForm.value.end;
      const company = this.basicForm.value.company;
      this.dialogService.showSpinner();
      this.siteService.addForecastReport(this.team.id, this.site.id, 
        company, name, start, end, Number(this.basicForm.value.startday))
        .subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.site) {
            this.site = new Site(data.site);
            this.changed.emit(this.site);
            if (this.site.forecasts) {
              this.site.forecasts.sort((a,b) => a.compareTo(b));
              this.selectedReport = new ForecastReport(
                this.site.forecasts[this.site.forecasts.length - 1]);
            }
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  onSelectPeriod() {
    const prdID = Number(this.periodForm.value.period);
    let length = 0;
    if (this.selectedReport.periods) {
      length = this.selectedReport.periods.length;
    }
    this.disableMoveFirst = (prdID === 0);
    this.disableMoveLast = (prdID === length - 1)
  }

  getDateString(date: Date): string {
    let answer = `${date.getFullYear()}-`;
    if (date.getMonth() < 9) {
      answer += '0';
    }
    answer += `${date.getMonth() + 1}-`;
    if (date.getDate() < 10) {
      answer += '0';
    }
    answer += `${date.getDate()}`;
    return answer;
  }
  
  onMovePeriod(direction: string) {
    if (this.selectedReport.periods) {
      const prdID = Number(this.periodForm.value.period);
      let prd = this.selectedReport.periods[prdID];
      const fromMonth = this.getDateString(prd.month);
      let toMonth = this.getDateString(prd.month);
      if (direction.toLowerCase().substring(0,1) === 'b') {
        prd = this.selectedReport.periods[prdID - 1];
        toMonth = this.getDateString(prd.month);
      } else {
        prd = this.selectedReport.periods[prdID + 1];
        toMonth = this.getDateString(prd.month);
      }
      this.dialogService.showSpinner();
      this.siteService.updateForecastReport(this.team.id, this.site.id, 
        this.selectedReport.id, 'move', `${fromMonth}|${toMonth}`).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.site) {
            this.site = new Site(data.site);
            this.changed.emit(this.site);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  onDelete() {
    if (this.selectedReport.id > 0) {
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
        data: {title: 'Confirm Forecast Report Deletion', 
        message: 'Are you sure you want to delete this Forecast Report?'},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          const rptID = Number(this.selectedReport.id);
          this.authService.statusMessage = "Deleting CofS Report";
          this.dialogService.showSpinner();
          this.siteService.deleteForecastReport(this.team.id, 
            this.site.id, rptID ).subscribe({
            next: (data: SiteResponse) => {
              this.dialogService.closeSpinner();
              if (data && data != null && data.site) {
                this.site = new Site(data.site);
                this.changed.emit(this.site);
              }
            },
            error: (err: SiteResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
        }
      });
    } 
  }
}
