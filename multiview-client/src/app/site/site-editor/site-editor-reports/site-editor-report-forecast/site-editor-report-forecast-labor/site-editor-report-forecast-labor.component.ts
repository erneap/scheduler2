import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { ForecastReport, IForecastReport } from 'src/app/models/sites/forecastreport';
import { LaborCode } from 'src/app/models/sites/laborcode';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-report-forecast-labor',
  templateUrl: './site-editor-report-forecast-labor.component.html',
  styleUrls: ['./site-editor-report-forecast-labor.component.scss'],
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
export class SiteEditorReportForecastLaborComponent {
  private _site: Site = new Site();
  @Input()
  public set site(site: ISite) {
    this._site = new Site(site);
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
  private _report: ForecastReport = new ForecastReport();
  @Input()
  public set report(rpt: IForecastReport) {
    this._report = new ForecastReport(rpt);
    this.onSelect();
  }
  get report(): ForecastReport {
    return this._report;
  }
  @Output() changed = new EventEmitter<Site>();
  laborForm: FormGroup;
  selectedLabor: LaborCode = new LaborCode();

  constructor(
    protected siteService: SiteService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.laborForm = this.fb.group({
      id: 'new|new',
      chargenumber: ['', [Validators.required]],
      extension: ['', [Validators.required]],
      clin: '',
      slin: '',
      wbs: '',
      location: '',
      slots: 1,
      hours: 0,
      emptyname: 'VACANT',
      exercise: false,
      start: [new Date(), [Validators.required]],
      end: [new Date, [Validators.required]],
    });
  }

  laborID(lc: LaborCode): string {
    return `${lc.chargeNumber}|${lc.extension}`;
  }

  onSelect() {
    const id = String(this.laborForm.value.id);
    const idparts = id.split("|");
    let found = false;
    if (this.report.laborCodes) {
      this.report.laborCodes.forEach(lc => {
        if (lc.chargeNumber == idparts[0] && lc.extension === idparts[1]) {
          found = true;
          this.selectedLabor = new LaborCode(lc);
        }
      });
    }
    if (!found) {
      this.selectedLabor = new LaborCode();
      this.selectedLabor.startDate = new Date(this.report.startDate.getTime());
      this.selectedLabor.endDate = new Date(this.report.endDate.getTime());
    }
    this.laborForm.controls['chargenumber']
      .setValue(this.selectedLabor.chargeNumber);
    this.laborForm.controls['extension']
      .setValue(this.selectedLabor.extension);
    this.laborForm.controls['clin']
      .setValue(this.selectedLabor.clin);
    this.laborForm.controls['slin']
      .setValue(this.selectedLabor.slin);
    this.laborForm.controls['wbs']
      .setValue(this.selectedLabor.wbs);
    this.laborForm.controls['location']
      .setValue(this.selectedLabor.location);
    this.laborForm.controls['slots']
      .setValue(this.selectedLabor.minimumEmployees);
    this.laborForm.controls['hours']
      .setValue(this.selectedLabor.hoursPerEmployee);
    this.laborForm.controls['emptyname']
      .setValue(this.selectedLabor.notAssignedName);
    this.laborForm.controls['exercise']
      .setValue(this.selectedLabor.exercise);
    this.laborForm.controls['start']
      .setValue(this.selectedLabor.startDate);
    this.laborForm.controls['end']
      .setValue(this.selectedLabor.endDate);
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

  onChange(field: string): void {
    const lcID = this.laborForm.value.id;
    let sField = field;
    if (lcID !== 'new|new') {
      let value: string = '';
      switch (field.toLowerCase()) {
        case "slots":
          value = (Math.round(this.laborForm.controls[field].value * 100) 
            / 100).toFixed(0);
          sField = "minimum"
          break;
        case "hours":
          value = (Math.round(this.laborForm.controls[field].value * 100) 
            / 100).toFixed(1);
          break;
        case "exercise":
          value = (this.laborForm.controls[field].value) ? "true" : "false";
          break;
        case "start":
        case "end":
          const tdate: Date = this.laborForm.controls[field].value
          value = this.getDateString(tdate);
          break;
        default:
          if (field === 'emptyname') {
            sField = 'notAssignedName';
          }
          value = this.laborForm.controls[field].value;
          break;
      }
      const chgNo = this.laborForm.value.chargenumber;
      const ext = this.laborForm.value.extension;

     if (value !== '') {
        this.authService.statusMessage = "Adding new labor code";
        this.dialogService.showSpinner();
        this.siteService.updateReportLaborCode(this.team.id, this.site.id, 
          this.report.id, chgNo, ext, sField, value).subscribe({
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
    const chgNo = this.laborForm.value.chargenumber;
    const ext = this.laborForm.value.extension;
    const startDate = this.laborForm.value.start;
    const endDate = this.laborForm.value.end;

    this.dialogService.showSpinner();
    this.siteService.createReportLaborCode(this.team.id, this.site.id, 
      this.report.id, chgNo, ext, this.laborForm.value.clin, 
      this.laborForm.value.slin, this.laborForm.value.wbs, 
      this.laborForm.value.location, this.laborForm.value.slots,
      this.laborForm.value.hours, this.laborForm.value.emptyname,
      this.laborForm.value.exercise, this.getDateString(startDate), 
      this.getDateString(endDate)).subscribe({
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

  onDelete() {
    if (this.laborForm.value.id !== 'new|new') {
      const chgNo = this.laborForm.value.chargeNumber;
      const ext = this.laborForm.value.extension;
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
        data: {title: 'Confirm Labor Code Deletion', 
        message: 'Are you sure you want to delete this Labor Code?'},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.dialogService.showSpinner();
          this.siteService.updateForecastReport(this.team.id, this.site.id, 
            this.report.id, "deletelabor", `${chgNo}|${ext}`).subscribe({
            next: (data: SiteResponse) => {
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
