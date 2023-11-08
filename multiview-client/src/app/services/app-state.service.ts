import { Injectable } from '@angular/core';
import { ViewState } from '../models/state/viewstate';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private viewState: ViewState;

  constructor() { 
    console.log(`${window.innerHeight} x ${window.innerWidth}`);
    if (window.innerWidth < 450 || window.innerHeight < 450) {
      this.viewState = ViewState.Mobile;
    } else if (window.innerWidth < 1040) {
      this.viewState = ViewState.Tablet;
    } else {
      this.viewState = ViewState.Desktop;
    }
    console.log(this.viewState.toString());
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
