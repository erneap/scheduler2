import { Component } from '@angular/core';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-employee-profile',
  templateUrl: './employee-profile.component.html',
  styleUrls: ['./employee-profile.component.scss']
})
export class EmployeeProfileComponent {
  constructor(
    protected appState: AppStateService
  ) {}

  viewClass(): string {
    if (this.appState.isMobile() || this.appState.isTablet()) {
      return "flexlayout column topleft";
    }
    return "fxLayout flexlayout column topleft";
  }

  cardClass(): string {
    if (this.appState.isMobile() || this.appState.isTablet()) {
      return "background-color: #3f51b3;color: white; width: 100%;";
    }
    return "background-color: #3f51b3;color: white;";
  }
}
