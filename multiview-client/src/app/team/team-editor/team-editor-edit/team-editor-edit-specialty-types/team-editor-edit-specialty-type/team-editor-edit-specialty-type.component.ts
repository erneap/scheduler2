import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecialtyType } from 'src/app/models/teams/contacttype';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-editor-edit-specialty-type',
  templateUrl: './team-editor-edit-specialty-type.component.html',
  styleUrls: ['./team-editor-edit-specialty-type.component.scss']
})
export class TeamEditorEditSpecialtyTypeComponent {
  private _team: Team = new Team();
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  } 
  get team(): Team {
    return this._team;
  }
  private _specialty: SpecialtyType = new SpecialtyType();
  @Input()
  public set specialty(ct: SpecialtyType) {
    this._specialty = new SpecialtyType(ct);
    this.setSpecialty();
  }
  get specialty(): SpecialtyType {
    return this._specialty;
  }
  @Input() select: number = 0
  @Output() selected = new EventEmitter<number>();
  @Output() changed = new EventEmitter<Team>();
  specialtyForm: FormGroup;

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.specialtyForm = this.fb.group({
      title: ['', [Validators.required]],
      comparearray: '',
    });
  }

  setSpecialty() {
    this.specialtyForm.controls['title'].setValue(this.specialty.name);
  }

  buttonColor() {
    return (this.select === this.specialty.id) ? 'primary' : 'accent';
  }

  buttonText() {
    return (this.select === this.specialty.id) ? 'Selected' : 'Select';
  }

  onSelect() {
    this.selected.emit(this.specialty.id);
  }

  onChange() {
    if (this.specialty.id !== 0 && this.specialtyForm.valid) {
      this.dialogService.showSpinner();
      this.teamService.updateSpecialtyType(this.team.id, this.specialty.id, 
        'title', this.specialtyForm.value.title)
      .subscribe({
        next: (resp: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (resp && resp.team) {
            this.team = new Team(resp.team);
            this.changed.emit(this.team);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  onAdd() {
    if (this.specialtyForm.valid) {
      this.dialogService.showSpinner();
      this.teamService.addSpecialtyType(this.team.id, this.specialty.id, 
        this.specialtyForm.value.title)
      .subscribe({
        next: (resp: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (resp && resp.team) {
            this.team = new Team(resp.team);
            let max = 0;
            this.team.contacttypes.forEach(ct => {
              if (ct.id > max) {
                max = ct.id;
              }
            });
            this.specialtyForm.controls['title'].setValue('');
            this.selected.emit(max);
            this.changed.emit(this.team);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }
}
