import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ITeam, Team } from 'src/app/models/teams/team';
import { Workcode } from 'src/app/models/teams/workcode';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

export interface TeamWorkcodeUpdate {
  team: Team;
  workcode: Workcode;
}

@Component({
  selector: 'app-team-editor-edit-workcodes',
  templateUrl: './team-editor-edit-workcodes.component.html',
  styleUrls: ['./team-editor-edit-workcodes.component.scss']
})
export class TeamEditorEditWorkcodesComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>();
  selectedWorkcode: Workcode = new Workcode();
  codesForm: FormGroup;

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.codesForm = this.fb.group({
      workcode: '',
    })
  }

  updateTeam(update: TeamWorkcodeUpdate) {
    this.team = new Team(update.team);
    this.changed.emit(this.team);
    if (update.workcode && update.workcode.id === 'delete') {
      this.codesForm.controls['workcode'].setValue('');
      this.selectedWorkcode = new Workcode();
    } else {
      this.team.workcodes.forEach(wc => {
        if (update.workcode && update.workcode.id !== '') {
          this.codesForm.controls['workcode'].setValue(update.workcode.id);
          if (wc.id === update.workcode.id) {
            this.selectedWorkcode = new Workcode(wc);
          }
        } else {
          if (wc.id === this.selectedWorkcode.id) {
            this.selectedWorkcode = new Workcode(wc);
          }
        }
      });
    }
  }

  codeStyle(wc: Workcode): string {
    return `background-color: #${wc.backcolor};color: #${wc.textcolor};`;
  }

  onSelect() {
    const wcID = String(this.codesForm.value.workcode);
    this.selectedWorkcode = new Workcode();
    this.team.workcodes.forEach(wc => {
      if (wcID.toLowerCase() === wc.id.toLowerCase()) {
        this.selectedWorkcode = new Workcode(wc);
      }
    });
  }
}
