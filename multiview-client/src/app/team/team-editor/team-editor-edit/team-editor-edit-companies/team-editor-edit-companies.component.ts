import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Company, CompanyHoliday } from 'src/app/models/teams/company';
import { ITeam, Team } from 'src/app/models/teams/team';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

export interface TeamCompanyUpdate {
  team: Team;
  company: Company;
  holiday?: CompanyHoliday;
}

@Component({
  selector: 'app-team-editor-edit-companies',
  templateUrl: './team-editor-edit-companies.component.html',
  styleUrls: ['./team-editor-edit-companies.component.scss']
})
export class TeamEditorEditCompaniesComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>();
  selectedCompany: Company;
  companiesForm: FormGroup

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.companiesForm = this.fb.group({
      company: '',
    });
    this.selectedCompany = new Company();
  }

  onSelect() {
    const coID = this.companiesForm.value.company;
    this.team.companies.forEach(co => {
      if (co.id.toLowerCase() === coID.toLowerCase()) {
        this.selectedCompany = new Company(co);
      }
    });
  }

  updateTeam(update: TeamCompanyUpdate) {
    this.team = new Team(update.team);
    if (update.company && update.company.id === 'delete') {
      this.companiesForm.controls['company'].setValue('');
      this.selectedCompany = new Company();
    } else {
      this.team.companies.forEach(co => {
        if (update.company && update.company.id !== '') {
          this.companiesForm.controls['company'].setValue(update.company.id);
          if (co.id === update.company.id) {
            this.selectedCompany = new Company(co);
          }
        } else {
          if (co.id === this.selectedCompany.id) {
            this.selectedCompany = new Company(co);
          }
        }
      })
    }
  }
}
