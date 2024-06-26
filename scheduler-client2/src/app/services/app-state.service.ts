import { Injectable } from '@angular/core';
import { ViewState } from '../models/state/viewstate';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  public viewState: ViewState;
  public viewHeight: number;
  public viewWidth: number;
  public showMenu: boolean

  constructor() { 
    this.viewHeight = window.innerHeight - 82;
    this.viewWidth = window.innerWidth;
    console.log(this.viewWidth);
    if (window.innerWidth < 450 || window.innerHeight < 450) {
      this.viewState = ViewState.Mobile;
    } else if (window.innerWidth < 1040) {
      this.viewState = ViewState.Tablet;
    } else {
      this.viewState = ViewState.Desktop;
    }
    this.showMenu = !this.isMobile();
  }

  isMobile(): boolean {
    return this.viewState === ViewState.Mobile;
  }

  isTablet(): boolean {
    return this.viewState === ViewState.Tablet;
  }

  isDesktop(): boolean {
    return this.viewState === ViewState.Desktop;
  }

  getWebLabel(team: string, site: string): string {
    if (team !== '' && site !== '') {
      return (this.isDesktop()) 
        ? `${team.toUpperCase()} - ${site.toUpperCase()} Scheduler`
        : `${site.toUpperCase()}`;
    } else if (team !== '') {
      return (this.isDesktop()) 
        ? `${team.toUpperCase()}  Scheduler`
        : `${team.toUpperCase()}`;
    } else if (site !== '') {
      return (this.isDesktop()) 
        ? `${site.toUpperCase()} Scheduler`
        : `${site.toUpperCase()}`;
    }
    return 'Scheduler';
  }

  toggle() {
    this.showMenu = !this.showMenu;
    this.viewWidth = window.innerWidth;
    if (this.showMenu && !this.isMobile()) {
      this.viewWidth -= 250;
    }
  }
}
