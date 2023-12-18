import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

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
    this.setTeam();
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>();
  basicForm: FormGroup;

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.basicForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  updateTeam(team: Team) {
    this.team = team;
    this.changed.emit(this.team);
  }

  setTeam() {
    this.basicForm.controls['name'].setValue(this.team.name);
  }

  onChange() {
    this.dialogService.showSpinner();
    this.teamService.updateTeam(this.team.id, this.basicForm.value.name)
    .subscribe({
      next: (data: SiteResponse) => {
        this.dialogService.closeSpinner();
        if (data && data != null && data.team) {
          this.team = data.team;
          this.changed.emit(new Team(data.team));
        }
      },
      error: (err: SiteResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    });
  }
}
