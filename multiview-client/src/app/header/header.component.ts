import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppStateService } from '../services/app-state.service';
import { AuthService } from '../services/auth.service';
import { SiteService } from '../services/site.service';
import { TeamService } from '../services/team.service';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    protected appState: AppStateService,
    protected authService: AuthService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected msgService: MessageService,
    private router: Router
  ) {
    iconRegistry.addSvgIcon('calendar',
      sanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/icons/calendar.svg'));
  }

  getLabel(): string {
    if (this.authService.isAuthenticated) {
      const site = this.siteService.getSite();
      const team = this.teamService.getTeam();
      if (this.appState.isMobile()) {
        if (site) {
          return `${site.name} Scheduler`;
        }
      } else {
        if (site && team) {
          return `${team.name} - ${site.name} Scheduler`
        }
      }
    } 
    return "Scheduler";
  }

  viewLogin(): void {
    this.router.navigateByUrl('/login');
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
