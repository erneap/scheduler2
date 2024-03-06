import { Injectable } from '@angular/core';
import { ViewState } from '../models/state/viewstate';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private viewState: ViewState;
  public viewHeight: number;
  public viewWidth: number;

  constructor() { 
    this.viewHeight = window.innerHeight - 82;
    this.viewWidth = window.innerWidth;
    if (window.innerWidth < 450 || window.innerHeight < 450) {
      this.viewState = ViewState.Mobile;
    } else if (window.innerWidth < 1040) {
      this.viewState = ViewState.Tablet;
    } else {
      this.viewState = ViewState.Desktop;
    }
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
}
