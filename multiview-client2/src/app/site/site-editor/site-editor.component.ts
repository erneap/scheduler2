import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-editor',
  templateUrl: './site-editor.component.html',
  styleUrls: ['./site-editor.component.scss']
})
export class SiteEditorComponent {
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
  @Output() changed = new EventEmitter<Site>()

  constructor(
    protected siteService: SiteService,
    protected teamService: TeamService
  ) {
    const site = this.siteService.getSite();
    if (site) {
      this.site = site;
    }
    const team = this.teamService.getTeam();
    if (team) {
      this.team = new Team(team);
    }
  }

  updateSite(site: Site) {
    this.site = new Site(site);
    const isite = this.siteService.getSite();
    if (isite && isite.id === this.site.id) {
      this.siteService.setSite(this.site);
      this.changed.emit(this.site);
    }
    const team = this.teamService.getTeam();
    if (team) {
      let found = false;
      for (let i=0; i < team.sites.length && !found; i++) {
        if (team.sites[i].id === this.site.id) {
          team.sites[i] = new Site(this.site);
          found = true;
        }
      }
      if (!found) {
        team.sites.push(new Site(this.site));
      }
      this.teamService.setTeam(team);
    }
  }
}
