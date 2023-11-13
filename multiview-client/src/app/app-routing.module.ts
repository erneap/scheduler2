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
import { EmployeeNoticesDesktop } from './employee/employee-notices/employee-notices.desktop';
import { EmployeeNoticesMobile } from './employee/employee-notices/employee-notices.mobile';
import { EmployeeNoticesTablet } from './employee/employee-notices/employee-notices.tablet';
import { EmployeeLeaveRequestEditorTablet } from './employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.tablet';
import { EmployeeLeaveRequestEditorMobile } from './employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.mobile';
import { EmployeeContactInfoDesktop } from './employee/employee-contact-info/employee-contact-info.desktop';
import { EmployeeContactInfoMobile } from './employee/employee-contact-info/employee-contact-info.mobile';
import { EmployeeContactInfoTablet } from './employee/employee-contact-info/employee-contact-info.tablet';
import { EmployeeSpecialtiesMobile } from './employee/employee-specialties/employee-specialties.mobile';
import { EmployeeSpecialtiesDesktop } from './employee/employee-specialties/employee-specialties.desktop';
import { EmployeeSpecialtiesComponent } from './employee/employee-specialties/employee-specialties.component';
import { SiteScheduleDesktop } from './site/site-schedule/site-schedule/site-schedule.desktop';
import { SiteScheduleTablet } from './site/site-schedule/site-schedule/site-schedule.tablet';
import { SiteScheduleMobile } from './site/site-schedule/site-schedule/site-schedule.mobile';
import { SiteCoverageComponent } from './site/site-schedule/site-coverage/site-coverage.component';
import { SiteCoverageMobile } from './site/site-schedule/site-coverage/site-coverage.mobile';
import { SiteMidScheduleComponent } from './site/site-schedule/site-mid-schedule/site-mid-schedule.component';
import { SiteMidScheduleMobile } from './site/site-schedule/site-mid-schedule/site-mid-schedule.mobile';
import { QueryComponent } from './query/query.component';
import { QueryMobile } from './query/query.mobile';
import { SiteEmployeesComponent } from './site/site-employees/site-employees.component';

const desktop_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'notifications', component: EmployeeNoticesDesktop },
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthDesktop},
      {path: 'ptoholidays', component: EmployeePTOHolidaysChartDesktop },
      {path: 'profile', component: EmployeeProfileDesktop },
      {path: 'leaverequest', component: EmployeeLeaveRequestEditorDesktop },
      {path: 'contacts', component: EmployeeContactInfoDesktop },
      {path: 'specialties', component: EmployeeSpecialtiesDesktop }
    ]
  },
  {path: 'site', 
    children: [
      {path: 'schedule',
        children: [
          {path: 'schedule', component: SiteScheduleDesktop },
          {path: 'coverage', component: SiteCoverageComponent },
          {path: 'mids', component: SiteMidScheduleComponent }
        ]
      },
      {path: 'editor',
        children: [
          {path: 'employees', component: SiteEmployeesComponent }
        ]
      }
    ]
  },
  {path: 'query', component: QueryComponent},
  {path: '**', redirectTo: 'login'}
];

const mobile_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'notifications', component: EmployeeNoticesMobile },
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthMobile},
      {path: 'ptoholidays', component: EmployeePTOHolidaysChartMobile },
      {path: 'profile', component: EmployeeProfileMobile },
      {path: 'leaverequest', component: EmployeeLeaveRequestEditorMobile },
      {path: 'contacts', component: EmployeeContactInfoMobile },
      {path: 'specialties', component: EmployeeSpecialtiesMobile }
    ]
  },
  {path: 'site', 
    children: [
      {path: 'schedule',
        children: [
          {path: 'schedule', component: SiteScheduleMobile },
          {path: 'coverage', component: SiteCoverageMobile },
          {path: 'mids', component: SiteMidScheduleMobile }
        ]
      },
    ]
  },
  {path: 'query', component: QueryMobile},
  {path: '**', redirectTo: 'login'}
];

const tablet_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'notifications', component: EmployeeNoticesTablet },
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthTablet},
      {path: 'ptoholidays', component: EmployeePTOHolidaysChartTablet },
      {path: 'profile', component: EmployeeProfileTablet },
      {path: 'leaverequest', component: EmployeeLeaveRequestEditorTablet },
      {path: 'contacts', component: EmployeeContactInfoTablet },
      {path: 'specialties', component: EmployeeSpecialtiesDesktop }
    ]
  },
  {path: 'site', 
    children: [
      {path: 'schedule',
        children: [
          {path: 'schedule', component: SiteScheduleTablet },
          {path: 'coverage', component: SiteCoverageMobile },
          {path: 'mids', component: SiteMidScheduleMobile }
        ]
      }
    ]
  },
  {path: 'query', component: QueryMobile},
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
