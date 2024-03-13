import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListItem } from 'src/app/generic/button-list/listitem';
import { Company, ICompany, ModPeriod } from 'src/app/models/teams/company';
import { ITeam, Team } from 'src/app/models/teams/team';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-company-modtime',
  templateUrl: './team-company-modtime.component.html',
  styleUrls: ['./team-company-modtime.component.scss']
})
export class TeamCompanyModtimeComponent {
  private _team: Team = new Team();
  private _company?: Company = new Company();
  @Input()
  public set team(iTeam: ITeam) {
    this._team = new Team(iTeam);
  }
  get team(): Team {
    return this._team;
  }
  @Input()
  public set company(iCompany: ICompany | undefined) {
    if (iCompany) {
      this._company = new Company(iCompany);
    } else {
      this._company = new Company();
    }
    this.setPeriods();
  }
  get company(): Company {
    if (this._company) {
      return this._company;
    }
    return new Company();
  }
  @Output() teamChanged = new EventEmitter<Team>();
  periods: ListItem[] = [];
  selected: ModPeriod;
  modForm: FormGroup;

  constructor(
    protected teamService: TeamService,
    private fb: FormBuilder
  ) {
    const now = new Date();
    this.modForm = this.fb.group({
      year: [now.getFullYear(), [Validators.required]],
      start: [now, [Validators.required]],
      end: [now, [Validators.required]],
    });
    this.selected = new ModPeriod();
    this.selected.year = 0;
    this.onSelect(`${this.selected.year}`);
  }

  setPeriods() {
    this.periods = [];
    this.periods.push(new ListItem('0', 'Add New Mod Period'))
    this.company.modperiods.sort((a,b) => a.compareTo(b));
    this.company.modperiods.forEach(mp => {
      this.periods.push(new ListItem(`${mp.year}`, `${mp.year}`));
    })
  }

  getButtonClass(id: string) {
    let answer = 'employee';
    if (`${this.selected.year}` === id) {
      answer += ' active';
    }
    return answer;
  }

  onSelect(id: string) {
    if (id === 'new') {
      this.selected = new ModPeriod();
      this.selected.year = 0;
    } else {
      const year = Number(id);
      this.company.modperiods.forEach(mp => {
        if (mp.year === year) {
          this.selected = new ModPeriod(mp);
        }
      })
    }
    this.setModPeriod();
  }

  setModPeriod() {
    if (this.selected.year === 0) {
      const now = new Date();
      this.modForm.controls['year'].setValue(now.getFullYear());
      this.modForm.controls['start'].setValue(now);
      this.modForm.controls['end'].setValue(now);
    } else {
      this.modForm.controls['year'].setValue(this.selected.year);
      this.modForm.controls['start'].setValue(this.selected.start);
      this.modForm.controls['end'].setValue(this.selected.end);
    }
  }
}
