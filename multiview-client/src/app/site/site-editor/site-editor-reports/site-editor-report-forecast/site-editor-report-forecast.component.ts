import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISite, Site } from 'src/app/models/sites/site';
import { ITeam, Team } from 'src/app/models/teams/team';

@Component({
  selector: 'app-site-editor-report-forecast',
  templateUrl: './site-editor-report-forecast.component.html',
  styleUrls: ['./site-editor-report-forecast.component.scss']
})
export class SiteEditorReportForecastComponent {
  private _site: Site = new Site();
  @Input()
  public set site(site: ISite) {
    this._site = new Site(site);
  }
  get site(): Site {
    return this._site;
  }
  private _team: Team = new Team();
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  @Output() changed = new EventEmitter<Site>();

  updateSite(site: Site) {
    this.site = new Site(site);
    this.changed.emit(this.site);
  }
}
