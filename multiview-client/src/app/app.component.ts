import { Component } from '@angular/core';
import { AppStateService } from './services/app-state.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
