import { Component } from '@angular/core';
import { Team } from 'src/app/models/teams/team';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-editor',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent {
  team: Team = new Team();

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
}
