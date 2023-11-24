import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';

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
  @Output() changed = new EventEmitter<Team>();
  selectedSite: Site = new Site()
  sitesForm: FormGroup;
  disableDeleteButton: boolean = true;

  constructor(
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
}
