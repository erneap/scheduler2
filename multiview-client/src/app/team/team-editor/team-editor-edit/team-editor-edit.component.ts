import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeam, Team } from 'src/app/models/teams/team';

@Component({
  selector: 'app-team-editor-edit',
  templateUrl: './team-editor-edit.component.html',
  styleUrls: ['./team-editor-edit.component.scss']
})
export class TeamEditorEditComponent {
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
