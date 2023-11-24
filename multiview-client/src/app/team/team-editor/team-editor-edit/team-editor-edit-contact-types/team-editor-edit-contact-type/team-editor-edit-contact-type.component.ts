import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactType } from 'src/app/models/teams/contacttype';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-editor-edit-contact-type',
  templateUrl: './team-editor-edit-contact-type.component.html',
  styleUrls: ['./team-editor-edit-contact-type.component.scss']
})
export class TeamEditorEditContactTypeComponent {
  private _team: Team = new Team();
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  } 
  get team(): Team {
    return this._team;
  }
  private _contact: ContactType = new ContactType();
  @Input()
  public set contacttype(ct: ContactType) {
    this._contact = new ContactType(ct);
    this.setContactType();
  }
  get contacttype(): ContactType {
    return this._contact;
  }
  private _compare: string[] = [];
  @Input()
  public set compare(values: string[]) {
    this._compare = values;
    let codes = '';
    this._compare.forEach(s => {
      if (codes !== '') {
        codes += ",";
      }
      codes += s;
    })
    this.contactForm.controls['comparearray'].setValue(codes);
  }
  get compare(): string[] {
    return this._compare;
  }
  @Input() select: number = 0
  @Output() selected = new EventEmitter<number>();
  @Output() changed = new EventEmitter<Team>();
  contactForm: FormGroup;

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      title: ['', [Validators.required]],
      comparearray: '',
    });
  }

  setContactType() {
    this.contactForm.controls['title'].setValue(this.contacttype.name);
  }

  buttonColor() {
    return (this.select === this.contacttype.id) ? 'primary' : 'accent';
  }

  buttonText() {
    return (this.select === this.contacttype.id) ? 'Selected' : 'Select';
  }

  onSelect() {
    this.selected.emit(this.contacttype.id);
  }

  onChange() {
    if (this.contacttype.id !== 0 && this.contactForm.valid) {
      this.dialogService.showSpinner();
      this.teamService.updateContactType(this.team.id, this.contacttype.id, 
        'title', this.contactForm.value.title)
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
    if (this.contactForm.valid) {
      this.dialogService.showSpinner();
      this.teamService.addContactType(this.team.id, this.contacttype.id, 
        this.contactForm.value.title)
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
            this.contactForm.controls['title'].setValue('');
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
