import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { ContactType } from 'src/app/models/teams/contacttype';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-editor-edit-contact-types',
  templateUrl: './team-editor-edit-contact-types.component.html',
  styleUrls: ['./team-editor-edit-contact-types.component.scss']
})
export class TeamEditorEditContactTypesComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
    this.setButtons();
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>();
  selectedContactType: number = 0;
  compare: string[] = [];
  disableUp: boolean = true;
  disableDown: boolean = true;
  disableDelete: boolean = true;

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
  }

  getNewContactType(): ContactType {
    return new ContactType();
  }

  onSelect(id: number) {
    if (this.selectedContactType !== id) {
      this.selectedContactType = id;
    } else {
      this.selectedContactType = 0;
    }
    this.setButtons();
  }

  setButtons() {
    this.disableDelete = (this.selectedContactType === 0);
    this.disableDown = true;
    this.disableUp  = true;

    if (this.selectedContactType > 0) {
      let minSort = -1;
      let maxSort = -1;
      this.team.contacttypes.forEach(ct => {
        if ((ct.sort > minSort && minSort === -1) || ct.sort < minSort) {
          minSort = ct.sort;
        }
        if (ct.sort > maxSort) {
          maxSort = ct.sort
        }
      });
      this.team.contacttypes.forEach(ct => {
        if (ct.id === this.selectedContactType) {
          this.disableUp = (ct.sort === minSort);
          this.disableDown = (ct.sort === maxSort);
        }
      })
    }
  }

  onUpdateTeam(team: Team) {
    this.team = team;
    this.changed.emit(team);
  }

  onMove(direction: string) {
    this.dialogService.showSpinner();
    this.authService.statusMessage = "Changing Sort";
    const id = this.selectedContactType;
    const field = 'sort';
    this.teamService.updateContactType(this.team.id, id, field, direction)
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

  onDelete() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Contact Type Deletion', 
      message: 'Are you sure you want to delete this contact type?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.teamService.deleteContactType(this.team.id, 
          this.selectedContactType).subscribe({
          next: (resp: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (resp && resp.team) {
              this.team = new Team(resp.team);
              this.selectedContactType = 0;
              this.changed.emit(this.team);
            }
          },
          error: (err: SiteResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    });
  }

  maxHeight(): string {
    let height = window.innerHeight - 400;
    return `max-height: ${height}px;`;
  }
}
