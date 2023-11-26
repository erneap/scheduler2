import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeam, Team } from 'src/app/models/teams/team';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent {
  private _team: Team = new Team();
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>();

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService
   ) {
    const team = this.teamService.getTeam();
    if (team) {
      this.team = new Team(team);
    }
  }

  updateTeam(team: Team) {
    const cteam = this.teamService.getTeam();
    if (team.id === this.team.id) {
      this.team = new Team(team);
      if (cteam && cteam.id === this.team.id) {
        this.teamService.setTeam(this.team);
      }
      this.changed.emit(this.team);
    }
  }
}
