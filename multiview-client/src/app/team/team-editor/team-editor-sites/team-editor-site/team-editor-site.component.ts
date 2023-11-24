import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';

@Component({
  selector: 'app-team-editor-site',
  templateUrl: './team-editor-site.component.html',
  styleUrls: ['./team-editor-site.component.scss']
})
export class TeamEditorSiteComponent {
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  private _team: Team = new Team();
  @Input()
  public set team(iteam: ITeam) {
    this._team = new Team(iteam);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Team>()
}
