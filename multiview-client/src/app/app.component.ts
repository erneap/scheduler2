import { Component, HostListener } from '@angular/core';
import { AppStateService } from './services/app-state.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostListener('window:unload', [ '$event'])
  unloadHandler(event: any) {
    console.log(event);
    for (var key in localStorage) {
      if (key.substring(0, 4).toLowerCase() === 'work') {
        localStorage.removeItem(key);
      }
    }
    this.authService.logout();
  }
  title = 'multiview-client';

  constructor(
    protected appState: AppStateService,
    protected authService: AuthService
  ) {
  }

  getHeight(): string {
    let height = window.innerHeight - 82;
    return `min-height: ${height}px;max-height: ${height}px;`;
  }
}
