import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company, CompanyHoliday, ICompany } from 'src/app/models/teams/company';
import { ITeam, Team } from 'src/app/models/teams/team';
import { TeamCompanyUpdate } from '../team-editor-edit-companies.component';
import { TeamService } from 'src/app/services/team.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-team-editor-edit-companies-company-holidays',
  templateUrl: './team-editor-edit-companies-company-holidays.component.html',
  styleUrls: ['./team-editor-edit-companies-company-holidays.component.scss'],
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
export class TeamEditorEditCompaniesCompanyHolidaysComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
    console.log('team');
  }
  get team(): Team {
    return this._team;
  }
  private _company: Company = new Company()
  @Input()
  public set company(co: ICompany) {
    this._company = new Company(co);
  }
  get company(): Company {
    return this._company;
  }
  @Output() changed = new EventEmitter<TeamCompanyUpdate>();
  selectedHoliday: CompanyHoliday = new CompanyHoliday();
  selectedActualDate: Date = new Date();
  holidaysForm: FormGroup;
  holidayForm: FormGroup;
  disableHolidayUp: boolean = true;
  disableHolidayDown: boolean = true;
  disableActualDelete: boolean = true;
  months: string[] = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.holidaysForm = this.fb.group({
      holiday: '',
    });
    this.holidayForm = this.fb.group({
      id: 'H',
      name: ['', [Validators.required]],
      actual: '',
      actualdate: new Date(),
    });
  }

  holidayID(hol: CompanyHoliday): string {
    return `${hol.id}${hol.sort}`;
  }

  onSelectHoliday() {
    const holID = String(this.holidaysForm.value.holiday);
    if (holID.length > 1) {
      const holType = holID.substring(0,1);
      const sortID = Number(holID.substring(1));
      for (let i=0; i < this.company.holidays.length; i++) {
        const hol = this.company.holidays[i]
        if (hol.id.toLowerCase() === holType.toLowerCase() 
          && sortID === hol.sort) {
          this.selectedHoliday = new CompanyHoliday(hol);
          this.disableHolidayDown = (i === this.company.holidays.length - 1);
          this.disableHolidayUp = (i === 0);
        }
      }
    } else {
      this.selectedHoliday = new CompanyHoliday();
      this.disableHolidayDown = true;
      this.disableHolidayUp = true;
    }
  }

  actualLabel(date: Date): string {
    return `${date.getDate()} ${this.months[date.getMonth()]} `
      + `${date.getFullYear()}`;
  }
}
