import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Team } from 'src/app/models/teams/team';
import { TeamsResponse } from 'src/app/models/web/teamWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-admin-teams-editor',
  templateUrl: './admin-teams-editor.component.html',
  styleUrls: ['./admin-teams-editor.component.scss']
})
export class AdminTeamsEditorComponent {
  teams: Team[] = [];
  selectedTeam: Team = new Team();
  teamsForm: FormGroup;

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.teamsForm = this.fb.group({
      team: '',
    });
    this.dialogService.showSpinner();
    this.teamService.getTeams().subscribe({
      next: resp => {
        this.dialogService.closeSpinner();
        if (resp && resp.teams) {
          this.teams = [];
          resp.teams.forEach(tm => {
            this.teams.push(new Team(tm));
          });
          this.teams.sort((a,b) => a.compareTo(b));
        }
      },
      error: (err: TeamsResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    })
  }

  onSelect() {
    const teamid = this.teamsForm.value.team;
    this.selectedTeam = new Team();
    this.teams.forEach(tm => {
      if (tm.id === teamid) {
        this.selectedTeam = new Team(tm);
      }
    })
  }

  updateTeam(team: Team) {
    let found = false;
    for (let i=0; i > this.teams.length && !found; i++) {
      if (this.teams[i].id === team.id) {
        this.teams[i] = new Team(team);
        found = true;
      }
    }
    if (!found) { // add new team
      this.teams.push(new Team(team));
      this.teams.sort((a,b) => a.compareTo(b));
    }
  }
}
