import { Component, Input } from '@angular/core';
import { ISite, Site } from 'src/app/models/sites/site';
import { Team } from 'src/app/models/teams/team';
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
  team: Team = new Team();

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
}
