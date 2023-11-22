import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { CofSCompany, CofSReport } from 'src/app/models/sites/cofsreport';
import { LaborCode } from 'src/app/models/sites/laborcode';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-report-cofs',
  templateUrl: './site-editor-report-cofs.component.html',
  styleUrls: ['./site-editor-report-cofs.component.scss'],
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
export class SiteEditorReportCOFSComponent {
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
  reports: CofSReport[] = [];
  selected: CofSReport = new CofSReport();
  selectedCompany: CofSCompany = new CofSCompany();
  companyLaborCodes: LaborCode[] = [];
  reportsForm: FormGroup;
  basicForm: FormGroup;
  companyForm: FormGroup;
  disableCompanyUpSort: boolean = true;
  disableCompanyDownSort: boolean = true;
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"];

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
    const companies: string[] = [];
    this.basicForm = this.fb.group({
      name: ['', [Validators.required]],
      short: ['', [Validators.required]],
      start: [new Date(), [Validators.required]],
      end: [new Date(), [Validators.required]],
      unit: ['', [Validators.required]],
      companies: [companies, [Validators.required]],
    });
    this.companyForm = this.fb.group({
      company: '',
      signature: ['', [Validators.required]],
      exercise: false,
      laborcodes: [[], [Validators.required]]
    })
  }

  setReports() {
    const rptid = this.selected.id;
    const coid = this.selectedCompany.id
    this.reports = [];
    let now = new Date();
    now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    const monthPrior = new Date(now.getTime() - (30 * 24 * 3600000)); // show month prior
    this.site.cofs.forEach(rpt => {
      if ((rpt.startdate.getTime() <= now.getTime() 
        && rpt.enddate.getTime() >= now.getTime()) 
        || (rpt.startdate.getTime() <= monthPrior.getTime() 
        && rpt.enddate.getTime() >= monthPrior.getTime())) {
        this.reports.push(new CofSReport(rpt));
      }
    });
    this.reports.sort((a,b) => a.compareTo(b));
    this.reportsForm.controls['report'].setValue(rptid);
    this.onSelect();
  }

  updateSite(site: Site) {
    this.site = new Site(site);
    this.changed.emit(this.site);
  }

  reportLabel(rpt: CofSReport): string {
    const start = `${rpt.startdate.getDate()} `
      + `${this.months[rpt.startdate.getMonth()]} ${rpt.startdate.getFullYear()}`;
    const end = `${rpt.enddate.getDate()} `
    + `${this.months[rpt.enddate.getMonth()]} ${rpt.enddate.getFullYear()}`;
    return `${rpt.name} (${start} - ${end})`;
  }

  onSelect() {
    const rptID = this.reportsForm.value.report;
    this.selected = new CofSReport();
    this.site.cofs.forEach(rpt => {
      if (rptID === rpt.id) {
        this.selected = new CofSReport(rpt);
      }
    });
    this.basicForm.controls['name'].setValue(this.selected.name);
    this.basicForm.controls['short'].setValue(this.selected.shortname);
    this.basicForm.controls['start'].setValue(this.selected.startdate);
    this.basicForm.controls['end'].setValue(this.selected.enddate);
    this.basicForm.controls['unit'].setValue(this.selected.unit);
    const companies: string[] = [];
    this.selected.companies.forEach(co => {
      companies.push(co.id);
    })
    this.basicForm.controls['companies'].setValue(companies);
    this.selected.companies.sort((a,b) => a.compareTo(b));
    if (this.selected.companies.length > 0) {
      this.companyForm.controls['company'].setValue(this.selected.companies[0].id);
      this.onSelectCompany();
    }
  }

  onSelectCompany() {
    const compID = this.companyForm.value.company;
    this.selectedCompany = new CofSCompany();
    this.selected.companies.sort((a,b) => a.compareTo(b));
    for (let i=0; i < this.selected.companies.length; i++) {
      if (compID === this.selected.companies[i].id) {
        this.selectedCompany = new CofSCompany(this.selected.companies[i]);
        this.disableCompanyUpSort = (i === 0);
        this.disableCompanyDownSort = (i === this.selected.companies.length - 1);
      }
    }
    const start = new Date(this.selected.startdate);
    const end = new Date(this.selected.enddate);
    this.companyLaborCodes = [];
    this.site.forecasts.forEach(rpt => {
      if ((rpt.startDate.getTime() <= end.getTime() 
        && rpt.endDate.getTime() >= start.getTime()) 
        && rpt.companyid?.toLowerCase() === compID) {
        rpt.laborCodes?.forEach(lc => {
          this.companyLaborCodes.push(new LaborCode(lc))
        });
      }
    });
    this.companyForm.controls['signature'].setValue(this.selectedCompany.signature);
    this.companyForm.controls['exercise'].setValue(this.selectedCompany.exercises);
    const laborcodes: string[] = [];
    this.selectedCompany.laborcodes.forEach(lc => {
      laborcodes.push(`${lc.chargeNumber}|${lc.extension}`);
    })
    this.companyForm.controls['laborcodes'].setValue(laborcodes);
  }

  companyLabel(co: CofSCompany): string {
    let answer = '';
    this.team.companies.forEach(tc => {
      if (co.id === tc.id) {
        answer = tc.name;
      }
    });
    return answer;
  }

  laborID(lc: LaborCode): string {
    return `${lc.chargeNumber}|${lc.extension}`;
  }

  getDateString(dt: Date) : string {
    let answer = '';
    if (dt.getMonth() < 9) {
      answer += "0"
    }
    answer += `${dt.getMonth() + 1}/`;
    if (dt.getDate() < 10) {
      answer += '0';
    }
    answer += `${dt.getDate()}/${dt.getFullYear()}`;
    return answer;
  }

  onChange(field: string) {
    if (this.selected.id > 0) {
      const rptID = Number(this.selected.id);
      let companyid: string | undefined = undefined;
      let value = '';
      switch (field.toLowerCase()) {
        case "short":
          value = this.basicForm.value.short;
          break;
        case "name":
          value = this.basicForm.value.name;
          break;
        case "unit":
          value = this.basicForm.value.unit;
          break;
        case "startdate":
          let dt = new Date(this.basicForm.value.start);
          value = this.getDateString(dt);
          break;
        case "enddate":
          let dte = new Date(this.basicForm.value.end);
          value = this.getDateString(dte);
          break;
        case "companies":
          this.basicForm.value.companies.forEach((co: string) => {
            if (value !== '') {
              value += '|';
            }
            value += co;
          });
          console.log(value);
          break;
        case "signature":
          companyid = this.selectedCompany.id;
          value = this.companyForm.value.signature;
          break;
        case "exercises":
          companyid = this.selectedCompany.id;
          value = `${this.companyForm.value.exercises}`;
          break;
        case "laborcodes":
          companyid = this.selectedCompany.id;
          this.companyForm.value.laborcodes.forEach((lc: string) => {
            if (value !== '') {
              value += ","
            }
            value += lc;
          });
          break;
      }
      this.dialogService.showSpinner();
      this.siteService.updateCofSReport(this.team.id, 
        this.site.id, rptID, field, value, companyid)
        .subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.site) {
            this.site = new Site(data.site);
            if (this.selected.id > 0) {
              const rptid = this.selected.id;
              const coid = this.selectedCompany.id;
              this.selected = new CofSReport();
              this.selectedCompany = new CofSCompany();
              this.site.cofs.forEach(rpt => {
                if (rptid === rpt.id) {
                  this.selected = new CofSReport(rpt);
                  if (coid !== '') {
                    this.selected.companies.forEach(co => {
                      if (co.id === coid) {
                        this.selectedCompany = new CofSCompany(co);
                      }
                    });
                  }
                }
              });
            }
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

  onAdd() {
    this.dialogService.closeSpinner();
    this.siteService.createCofSReport(this.team.id, 
      this.site.id, this.basicForm.value.name, 
      this.basicForm.value.short, 
      this.basicForm.value.unit,
      new Date(this.basicForm.value.start), 
      new Date(this.basicForm.value.end)).subscribe({
      next: (data: SiteResponse) => {
        this.dialogService.closeSpinner();
        if (data && data != null && data.site) {
          this.site = new Site(data.site);
          let newRpt = new CofSReport();
          this.site.cofs.forEach(rpt => {
            if (rpt.id > newRpt.id) {
              newRpt = rpt;
            }
          });
          this.reportsForm.controls['report'].setValue(newRpt.id);
          this.onSelect();
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
    if (this.selected.id > 0) {
      const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
        data: {title: 'Confirm CofS Report Deletion', 
        message: 'Are you sure you want to delete this CofS Report?'},
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          const rptID = Number(this.selected.id);
          this.dialogService.showSpinner();
          this.siteService.deleteCofSReport(this.team.id, this.site.id, rptID ).subscribe({
            next: (data: SiteResponse) => {
              this.dialogService.closeSpinner();
              if (data && data != null && data.site) {
                this.site = new Site(data.site);
                this.reportsForm.controls['report'].setValue(0);
                this.onSelect();
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

  onChangeSort(direction: string) {
    this.dialogService.showSpinner()
    this.siteService.updateCofSReport(this.team.id, 
      this.site.id, this.selected.id, "sort", direction, 
      this.selectedCompany.id).subscribe({
      next: (data: SiteResponse) => {
        this.dialogService.closeSpinner();
        if (data && data != null && data.site) {
          this.site = new Site(data.site);
          const rptid = this.selected.id;
          this.site.cofs.forEach(rpt => {
            if (rptid === rpt.id) {
              this.selected = new CofSReport(rpt);
              this.onSelect();
            }
          });
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
