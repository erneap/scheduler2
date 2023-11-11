import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { AppStateService } from 'src/app/services/app-state.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent {
  @Output() sidenav = new EventEmitter<any>();
  constructor(
    protected appState: AppStateService,
    protected authService: AuthService,
    private router: Router
  ) { }

  goToLink(url: string) {
    this.router.navigateByUrl(url);
    if (!this.appState.isDesktop()) {
      this.sidenav.emit();
    }
  }

  getHeight(): string {
    let height = window.innerHeight - 82;
    return `min-height: ${height}px;max-height: ${height}px;`;
  }
}
