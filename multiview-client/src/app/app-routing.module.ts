import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './header/login/login.component';
import { HomeComponent } from './home/home.component';
import { EmployeeScheduleMonthDesktop } from './employee/employee-schedule/employee-schedule-month/employee-schedule-month.desktop';
import { EmployeeScheduleMonthTablet } from './employee/employee-schedule/employee-schedule-month/employee-schedule-month.tablet';
import { AppStateService } from './services/app-state.service';
import { EmployeeScheduleMonthMobile } from './employee/employee-schedule/employee-schedule-month/employee-schedule-month.mobile';
import { EmployeePTOHolidaysChartDesktop } from './employee/employee-ptoholidays/employee-ptoholidays-chart/employee-ptoholidays-chart.desktop';
import { EmployeePTOHolidaysChartMobile } from './employee/employee-ptoholidays/employee-ptoholidays-chart/employee-ptoholidays-chart.mobile';
import { EmployeePTOHolidaysChartTablet } from './employee/employee-ptoholidays/employee-ptoholidays-chart/employee-ptoholidays-chart.tablet';
import { EmployeeProfileDesktop } from './employee/employee-profile/employee-profile.desktop';
import { EmployeeProfileMobile } from './employee/employee-profile/employee-profile.mobile';
import { EmployeeProfileTablet } from './employee/employee-profile/employee-profile.tablet';
import { EmployeeLeaveRequestEditorDesktop } from './employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.desktop';

const desktop_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthDesktop},
      {path: 'ptoholidays', component: EmployeePTOHolidaysChartDesktop },
      {path: 'profile', component: EmployeeProfileDesktop },
      {path: 'leaverequest', component: EmployeeLeaveRequestEditorDesktop }
    ]
  },
  {path: '**', redirectTo: 'login'}
];

const mobile_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthMobile},
      {path: 'ptoholidays', component: EmployeePTOHolidaysChartMobile },
      {path: 'profile', component: EmployeeProfileMobile }
    ]
  },
  {path: '**', redirectTo: 'login'}
];

const tablet_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthTablet},
      {path: 'ptoholidays', component: EmployeePTOHolidaysChartTablet },
      {path: 'profile', component: EmployeeProfileTablet }
    ]
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(desktop_routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  public constructor(private router: Router,
    private appState: AppStateService) {

    if (appState.isMobile()) {
      router.resetConfig(mobile_routes);
    } else if (appState.isTablet()) {
      router.resetConfig(tablet_routes);
    }
  }

  /**
   * this function inject new routes for the given module instead the current routes. the operation happens on the given current routes object so after
   * this method a call to reset routes on router should be called with the the current routes object.
   * @param currentRoutes
   * @param routesToInject
   * @param childNameToReplaceRoutesUnder - the module name to replace its routes.
   */
  private injectModuleRoutes(currentRoutes: Routes, routesToInject: Routes, childNameToReplaceRoutesUnder: string): void {
    for (let i = 0; i < currentRoutes.length; i++) {
      if (currentRoutes[i].loadChildren && currentRoutes[i].loadChildren != null &&
        currentRoutes[i].loadChildren?.toString().indexOf(childNameToReplaceRoutesUnder) != -1) {
        // we found it. taking the route prefix
        let prefixRoute: string | undefined = currentRoutes[i].path;
        // first removing the module line
        currentRoutes.splice(i, 1);
        // now injecting the new routes
        // we need to add the prefix route first
        if (prefixRoute) {
          this.addPrefixToRoutes(routesToInject, prefixRoute);
          for (let route of routesToInject) {
            currentRoutes.push(route);
          }
        }
        // since we found it we can break the injection
        return;
      }

      let routes = currentRoutes[i].children;
      if (routes) {
        this.injectModuleRoutes(routes, routesToInject, childNameToReplaceRoutesUnder);
      }
    }
  }

  private addPrefixToRoutes(routes: Routes, prefix: string) {
    for (let i = 0; i < routes.length; i++) {
      routes[i].path = prefix + '/' + routes[i].path;
    }
  }
}
