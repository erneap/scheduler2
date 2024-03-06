import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteService } from 'src/app/services/site.service';

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
  @Input() maxWidth: number = window.innerWidth - 500;
  @Output() changed = new EventEmitter<Team>()

  constructor(
    protected siteService: SiteService
  ) {}

  updateTeam(site: Site) {
    const oSite = this.siteService.getSite();
    this.site = site;
    if (oSite && oSite.id === this.site.id) {
      this.siteService.setSite(this.site);
    }
    let found = false;
    for (let i=0; i < this.team.sites.length && !found; i++) {
      if (this.site.id === this.team.sites[i].id) {
        this.team.sites[i] = new Site(this.site);
        found = true;
      }
    }
    this.changed.emit(this.team);
  }

  setWidth(): string {
    return `width: ${this.maxWidth - 50}px;`;
  }
}
