import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ITeam, Team } from 'src/app/models/teams/team';
import { IWorkcode, Workcode } from 'src/app/models/teams/workcode';
import { DuplicateValidator } from 'src/app/models/validators/duplicate-validator.directive';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';
import { TeamWorkcodeUpdate } from '../team-editor-edit-workcodes/team-editor-edit-workcodes.component';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';

@Component({
  selector: 'app-team-editor-edit-workcode',
  templateUrl: './team-editor-edit-workcode.component.html',
  styleUrls: ['./team-editor-edit-workcode.component.scss']
})
export class TeamEditorEditWorkcodeComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
    this.setWorkcodes()
  }
  get team(): Team {
    return this._team;
  }
  private _workcode: Workcode = new Workcode();
  @Input()
  public set workcode(wc: IWorkcode) {
    this._workcode = new Workcode(wc);
    this.setWorkcode();
  }
  get workcode(): Workcode {
    return this._workcode;
  }
  @Output() changed = new EventEmitter<TeamWorkcodeUpdate>();
  codeForm: FormGroup;
  formStyle: string = 'background-color: #ffffff;color: #000000;';
  hours: string[];

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.codeForm = this.fb.group({
      id: ['', [Validators.required, new DuplicateValidator()]],
      altcode: '',
      search: '',
      title: ['', [Validators.required]],
      start: '',
      leave: false,
      premimum: '',
      colors: ['000000-ffffff', 
        [Validators.required, 
          Validators.pattern('^[0-9a-fA-F]{6}\-[0-9a-fA-F]{6}$')]],
      comparearray: '',
    });
    this.hours = [];
    for (let i=0; i < 24; i++) {
      this.hours.push(`${i}`);
    }
  }

  setWorkcodes() {
    let codes = '';
    this.team.workcodes.forEach(wc => {
      if (codes !== '') {
        codes += ',';
      }
      codes += wc.id;
    });
    this.codeForm.controls['comparearray'].setValue(codes);
  }

  setWorkcode() {
    this.codeForm.controls['id'].setValue(this.workcode.id);
    if (this.workcode.id === '') {
      this.codeForm.controls['id'].enable();
    } else {
      this.codeForm.controls['id'].disable();
    }
    this.codeForm.controls['altcode'].setValue(this.workcode.altcode);
    this.codeForm.controls['search'].setValue(this.workcode.search);
    this.codeForm.controls['title'].setValue(this.workcode.title);
    this.codeForm.controls['start'].setValue(`${this.workcode.start}`);
    this.codeForm.controls['leave'].setValue(this.workcode.isLeave);
    this.codeForm.controls['premimum'].setValue(this.workcode.shiftCode);
    this.formStyle = `background-color: #${this.workcode.backcolor};`
      + `color: #${this.workcode.textcolor};padding: 5px;`;
    this.codeForm.controls['colors']
      .setValue(`${this.workcode.textcolor}-${this.workcode.backcolor}`);
  }

  onChange(field: string) {
    const sValue = this.codeForm.controls[field].value;
    if (field.toLowerCase() === 'colors' && this.codeForm.controls['colors'].valid) {
      const cParts = String(sValue).split('-');
      if (cParts.length > 1) {
        this.workcode.textcolor = cParts[0];
        this.workcode.backcolor = cParts[1];
        this.formStyle = `background-color: #${this.workcode.backcolor};`
          + `color: #${this.workcode.textcolor};padding: 5px;`;
      }
    }
    const value: string = `${sValue}`;
    console.log(typeof(value));
    if (field.toLowerCase() === 'leave') {
      this.workcode.isLeave = sValue;
    }
    if (this.workcode.id !== '' && this.codeForm.valid) {
      const value = this.codeForm.controls[field].value;
      this.dialogService.showSpinner();
      this.teamService.updateTeamWorkcode(this.team.id, this.workcode.id, field, 
      value).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.team) {
            this.team = new Team(data.team);
            const update: TeamWorkcodeUpdate = {
              team: this.team,
              workcode: new Workcode()
            }
            this.changed.emit(update);
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
    if (this.codeForm.valid) {
      this.dialogService.showSpinner();
    const colors = `${this.codeForm.value.colors}`.split("-");
    this.teamService.addTeamWorkcode(this.team.id, 
      this.codeForm.value.id,
      this.codeForm.value.title,
      Number(this.codeForm.value.start),
      this.codeForm.value.leave,
      String(this.codeForm.value.premimum),
      colors[0], colors[1], 
      this.codeForm.value.altcode,
      this.codeForm.value.search
      ).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.team) {
            this.team = new Team(data.team);
            const update: TeamWorkcodeUpdate = {
              team: this.team,
              workcode: new Workcode()
            }
            this.team.workcodes.forEach(wc => {
              if (wc.id === this.codeForm.value.id) {
                update.workcode = new Workcode(wc);
              }
            });
            this.changed.emit(update);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
    });
    }
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Workcode Deletion', 
      message: 'Are you sure you want to delete this Workcode?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.teamService.deleteTeamWorkcode(this.team.id, this.workcode.id)
        .subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.team) {
              this.team = new Team(data.team);
              const update: TeamWorkcodeUpdate = {
                team: this.team,
                workcode: new Workcode()
              }
              update.workcode.id = 'delete';
              this.changed.emit(update);
            }
            this.authService.statusMessage = "Addition complete"
          },
          error: (err: SiteResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    });
  }
}
