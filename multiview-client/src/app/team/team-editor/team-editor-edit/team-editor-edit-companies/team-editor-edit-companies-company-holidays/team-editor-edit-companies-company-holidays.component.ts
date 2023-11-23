import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company, CompanyHoliday, ICompany } from 'src/app/models/teams/company';
import { ITeam, Team } from 'src/app/models/teams/team';
import { TeamCompanyUpdate } from '../team-editor-edit-companies.component';
import { TeamService } from 'src/app/services/team.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-team-editor-edit-companies-company-holidays',
  templateUrl: './team-editor-edit-companies-company-holidays.component.html',
  styleUrls: ['./team-editor-edit-companies-company-holidays.component.scss']
})
export class TeamEditorEditCompaniesCompanyHolidaysComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
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
  holidaysForm: FormGroup;
  holidayForm: FormGroup;

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
      actual: new Date(),
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
      this.company.holidays.forEach(hol => {
        if (hol.id.toLowerCase() === holType.toLowerCase() 
          && sortID === hol.sort) {
          this.selectedHoliday = new CompanyHoliday(hol);
        }
      });
    } else {
      this.selectedHoliday = new CompanyHoliday();
    }
  }
}
