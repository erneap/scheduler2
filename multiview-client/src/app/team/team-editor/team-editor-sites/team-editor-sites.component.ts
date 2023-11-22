import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeam, Team } from 'src/app/models/teams/team';

@Component({
  selector: 'app-team-editor-sites',
  templateUrl: './team-editor-sites.component.html',
  styleUrls: ['./team-editor-sites.component.scss']
})
export class TeamEditorSitesComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>();
}
