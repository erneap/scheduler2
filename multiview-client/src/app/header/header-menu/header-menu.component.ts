import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from 'src/app/services/auth.service';
import { MessageService } from 'src/app/services/message.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent {
  constructor(
    protected appState: AppStateService,
    protected authService: AuthService,
    protected msgService: MessageService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    private router: Router
  ) {
    
  }

  logout() {
    this.siteService.clearSite();
    this.teamService.clearTeam();
    this.authService.setWebLabel('','');
    this.msgService.clearMessages();
    this.siteService.stopAutoUpdate();
    this.authService.logout();
  }
}
