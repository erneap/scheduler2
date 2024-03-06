import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-editor-sites',
  templateUrl: './team-editor-sites.component.html',
  styleUrls: ['./team-editor-sites.component.scss']
})
export class TeamEditorSitesComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
    this.onSelect();
  }
  get team(): Team {
    return this._team;
  }
  @Input() maxWidth: number = window.innerWidth - 500;
  @Output() changed = new EventEmitter<Team>();
  selectedSite: Site = new Site()
  sitesForm: FormGroup;
  disableDeleteButton: boolean = true;

  constructor(
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.sitesForm = this.fb.group({
      site: ''
    });
  }

  onSelect() {
    const siteID: string = this.sitesForm.value.site;
    this.selectedSite = new Site();
    this.disableDeleteButton = true;
    this.team.sites.forEach(site => {
      if (siteID.toLowerCase() === site.id.toLowerCase()) {
        this.selectedSite = new Site(site);
        this.disableDeleteButton = false;
      }
    });
  }

  updateTeam(team: Team) {
    if (this.selectedSite.id === '') {
      team.sites.forEach(sNew => {
        let found = false;
        this.team.sites.forEach(sOld => {
          if (sNew.id === sOld.id) {
            found = true;
          }
        })
        if (!found) {
          this.selectedSite = new Site(sNew);
          this.sitesForm.controls['site'].setValue(sNew.id);
        }
      });
    }
    this.team = team;
    this.changed.emit(this.team);
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Site Deletion',
      message:  'Are you sure you want to delete this Site?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.siteService.deleteSite(this.team.id, this.selectedSite.id)
        .subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data.team) {
              this.team = data.team;
              this.changed.emit(this.team);
            }
          },
          error: (err: SiteResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    })
  }

  setWidth(): string {
    return `width: ${this.maxWidth}px;`;
  }
}
