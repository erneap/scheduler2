import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactType } from 'src/app/models/teams/contacttype';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-team-contact-list',
  templateUrl: './team-contact-list.component.html',
  styleUrls: ['./team-contact-list.component.scss']
})
export class TeamContactListComponent {
  private _team: Team | undefined;
  @Input()
  public set team(tm: ITeam | undefined) {
    this._team = new Team(tm);
    this.teamid = this._team.id;
    this.setContactTypes();
  }
  get team(): Team | undefined {
    return this._team;
  }
  contactTypes: ContactType[] = [];
  contactForm: FormGroup;
  teamid: string = "";

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
    });
    this.setContactTypes();
  }

  setContactTypes() {
    this.contactTypes = [];
    this.contactForm.controls["name"].setValue("");
    if (!this.team) {
      const team = this.teamService.getTeam();
      if (team) {
        this.team = team;
      }
    } else {
      this.team.contacttypes.forEach(ct => {
        this.contactTypes.push(new ContactType(ct));
      });
      this.contactTypes.sort((a,b) => a.compareTo(b));
    }
  }

  addContactType() {
    this.dialogService.showSpinner();
    this.authService.statusMessage = "Adding Contact Type";
    this.teamService.addContactType(this.teamid, this.contactForm.value.name)
    .subscribe({
      next: (resp: SiteResponse) => {
        this.dialogService.closeSpinner();
        this.team = resp.team;
        if (resp.team) {
          this.teamService.setTeam(resp.team);
        }
        this.setContactTypes();
      },
      error: (err: SiteResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    });
  }

  updateContactType(update: string) {
    const parts = update.split("|");
    const id = Number(parts[0]);
    this.dialogService.showSpinner();
    this.authService.statusMessage = "Adding Contact Type";
    let field = "name"
    let value = parts[1];

    if (parts.length > 2) { // sort change
      field = parts[1];
      value = parts[2];
    } 
    if (field.toLowerCase() === "delete") {
      this.teamService.deleteContactType(this.teamid, id)
      .subscribe({
        next: (resp: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.team = resp.team;
          if (resp.team) {
            this.teamService.setTeam(resp.team);
          }
          this.setContactTypes();
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    } else {
      this.teamService.updateContactType(this.teamid, id, field, value)
      .subscribe({
        next: (resp: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.team = resp.team;
          if (resp.team) {
            this.teamService.setTeam(resp.team);
          }
          this.setContactTypes();
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }
}
