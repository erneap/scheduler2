import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './header/login/login.component';
import { EmployeeScheduleMonthTablet } from './employee/employee-schedule/employee-schedule-month/employee-schedule-month.tablet';
import { AppStateService } from './services/app-state.service';
import { EmployeeScheduleMonthMobile } from './employee/employee-schedule/employee-schedule-month/employee-schedule-month.mobile';
import { EmployeeProfileMobile } from './employee/employee-profile/employee-profile.mobile';
import { EmployeeNoticesDesktop } from './employee/employee-notices/employee-notices.desktop';
import { EmployeeNoticesMobile } from './employee/employee-notices/employee-notices.mobile';
import { EmployeeNoticesTablet } from './employee/employee-notices/employee-notices.tablet';
import { EmployeeLeaveRequestEditorTablet } from './employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.tablet';
import { EmployeeLeaveRequestEditorMobile } from './employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.mobile';
import { EmployeeContactInfoMobile } from './employee/employee-contact-info/employee-contact-info.mobile';
import { EmployeeSpecialtiesMobile } from './employee/employee-specialties/employee-specialties.mobile';
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
import { SiteLeaveApprovalComponent } from './site/site-leave-approval/site-leave-approval.component';
import { SiteLeaveApprovalMobile } from './site/site-leave-approval/site-leave-approval.mobile';
import { SiteEditorComponent } from './site/site-editor/site-editor.component';
import { TeamEditorComponent } from './team/team-editor/team-editor.component';
import { AddTeamComponent } from './team/add-team/add-team.component';
import { SiteFileIngestComponent } from './site/site-ingest/site-file-ingest/site-file-ingest.component';
import { EmployeePtoholidaysAltComponent } from './employee/employee-ptoholidays-alt/employee-ptoholidays-alt.component';
import { EmployeePtoholidaysAltMobile } from './employee/employee-ptoholidays-alt/employee-ptoholidays-alt.mobile';
import { AdminComponent } from './admin/admin.component';
import { ReportsSiteComponent } from './reports/reports-site/reports-site.component';
import { LogsComponent } from './logs/logs.component';
import { EmployeeContactInfoComponent } from './employee/employee-contact-info/employee-contact-info.component';
import { EmployeeSpecialtiesComponent } from './employee/employee-specialties/employee-specialties.component';
import { EmployeeLeaveRequestEditorComponent } from './employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.component';
import { EmployeeScheduleMonthComponent } from './employee/employee-schedule/employee-schedule-month/employee-schedule-month.component';
import { EmployeeProfileComponent } from './employee/employee-profile/employee-profile.component';

const desktop_routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'notifications', component: EmployeeNoticesDesktop },
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthComponent},
      {path: 'ptoholidays', component: EmployeePtoholidaysAltComponent },
      {path: 'profile', component: EmployeeProfileComponent },
      {path: 'leaverequest', component: EmployeeLeaveRequestEditorComponent },
      {path: 'contacts', component: EmployeeContactInfoComponent },
      {path: 'specialties', component: EmployeeSpecialtiesComponent }
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
          {path: 'employees', component: SiteEmployeesComponent },
          {path: 'leaveapprover', component: SiteLeaveApprovalComponent },
          {path: 'siteeditor', component: SiteEditorComponent }
        ]
      },
      {path: 'ingest', component: SiteFileIngestComponent }
    ]
  },
  {path: 'team',
    children: [
      {path: 'editor', component: TeamEditorComponent },
      {path: 'add', component: AddTeamComponent }
    ]
  },
  {path: 'admin', component: AdminComponent },
  {path: 'query', component: QueryComponent},
  {path: 'reports', component: ReportsSiteComponent },
  {path: 'logs', component: LogsComponent },
  {path: '**', redirectTo: 'login'}
];

const mobile_routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'notifications', component: EmployeeNoticesMobile },
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthMobile},
      {path: 'ptoholidays', component: EmployeePtoholidaysAltMobile },
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
      {path: 'editor',
        children: [
          {path: 'leaveapprover', component: SiteLeaveApprovalMobile }
        ]
      }
    ]
  },
  {path: 'query', component: QueryMobile},
  {path: '**', redirectTo: 'login'}
];

const tablet_routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'notifications', component: EmployeeNoticesTablet },
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleMonthTablet},
      {path: 'ptoholidays', component: EmployeePtoholidaysAltMobile },
      {path: 'profile', component: EmployeeProfileComponent },
      {path: 'leaverequest', component: EmployeeLeaveRequestEditorTablet },
      {path: 'contacts', component: EmployeeContactInfoComponent },
      {path: 'specialties', component: EmployeeSpecialtiesComponent }
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
      },
      {path: 'editor',
        children: [
          {path: 'leaveapprover', component: SiteLeaveApprovalComponent }
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
