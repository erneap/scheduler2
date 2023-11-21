import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { CofSReport } from 'src/app/models/sites/cofsreport';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
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
  reportsForm: FormGroup;
  basicForm: FormGroup;
  companyForm: FormGroup;
  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug",
      "Sep", "Oct", "Nov", "Dec"];

  constructor(
    protected siteService: SiteService,
    protected authService: AuthService,
    protected dialogService: DialogService,
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
      signature: '',
      exercise: false,
      laborcodes: [[], [Validators.required]]
    })
  }

  setReports() {
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

  }
}
