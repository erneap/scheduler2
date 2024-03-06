import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './header/login/login.component';
import { EmployeeScheduleMonthTablet } from './scheduler/employee/employee-schedule/employee-schedule-month/employee-schedule-month.tablet';
import { AppStateService } from './services/app-state.service';
import { EmployeeScheduleMonthMobile } from './scheduler/employee/employee-schedule/employee-schedule-month/employee-schedule-month.mobile';
import { EmployeeProfileMobile } from './scheduler/employee/employee-profile/employee-profile.mobile';
import { EmployeeNoticesDesktop } from './scheduler/employee/employee-notices/employee-notices.desktop';
import { EmployeeNoticesMobile } from './scheduler/employee/employee-notices/employee-notices.mobile';
import { EmployeeNoticesTablet } from './scheduler/employee/employee-notices/employee-notices.tablet';
import { EmployeeLeaveRequestEditorMobile } from './scheduler/employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.mobile';
import { EmployeeContactInfoMobile } from './scheduler/employee/employee-contact-info/employee-contact-info.mobile';
import { EmployeeSpecialtiesMobile } from './scheduler/employee/employee-specialties/employee-specialties.mobile';
import { SiteScheduleDesktop } from './scheduler/site/site-schedule/site-schedule/site-schedule.desktop';
import { SiteScheduleTablet } from './scheduler/site/site-schedule/site-schedule/site-schedule.tablet';
import { SiteScheduleMobile } from './scheduler/site/site-schedule/site-schedule/site-schedule.mobile';
import { SiteCoverageComponent } from './scheduler/site/site-schedule/site-coverage/site-coverage.component';
import { SiteCoverageMobile } from './scheduler/site/site-schedule/site-coverage/site-coverage.mobile';
import { SiteMidScheduleComponent } from './scheduler/site/site-schedule/site-mid-schedule/site-mid-schedule.component';
import { SiteMidScheduleMobile } from './scheduler/site/site-schedule/site-mid-schedule/site-mid-schedule.mobile';
import { QueryComponent } from './scheduler/query/query.component';
import { QueryMobile } from './scheduler/query/query.mobile';
import { SiteEmployeesComponent } from './scheduler/site/site-employees/site-employees.component';
import { SiteLeaveApprovalComponent } from './scheduler/site/site-leave-approval/site-leave-approval.component';
import { SiteLeaveApprovalMobile } from './scheduler/site/site-leave-approval/site-leave-approval.mobile';
import { SiteEditorComponent } from './scheduler/site/site-editor/site-editor.component';
import { TeamEditorComponent } from './scheduler/team/team-editor/team-editor.component';
import { AddTeamComponent } from './scheduler/team/add-team/add-team.component';
import { SiteFileIngestComponent } from './scheduler/site/site-ingest/site-file-ingest/site-file-ingest.component';
import { EmployeePtoholidaysAltComponent } from './scheduler/employee/employee-ptoholidays-alt/employee-ptoholidays-alt.component';
import { EmployeePtoholidaysAltMobile } from './scheduler/employee/employee-ptoholidays-alt/employee-ptoholidays-alt.mobile';
import { AdminComponent } from './admin/admin.component';
import { ReportsSiteComponent } from './reports/reports-site/reports-site.component';
import { LogsComponent } from './logs/logs.component';
import { EmployeeContactInfoComponent } from './scheduler/employee/employee-contact-info/employee-contact-info.component';
import { EmployeeSpecialtiesComponent } from './scheduler/employee/employee-specialties/employee-specialties.component';
import { EmployeeLeaveRequestEditorComponent } from './scheduler/employee/employee-leave-request/employee-leave-request-editor/employee-leave-request-editor.component';
import { EmployeeScheduleMonthComponent } from './scheduler/employee/employee-schedule/employee-schedule-month/employee-schedule-month.component';
import { EmployeeProfileComponent } from './scheduler/employee/employee-profile/employee-profile.component';
import { ForgotPasswordComponent } from './header/forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './header/forgot-password-reset/forgot-password-reset.component';
import { MissionsHomeComponent } from './metrics/missions/home/home.component';
import { GroundOutageComponent } from './metrics/ground-outage/ground-outage.component';
import { AuthGuard } from './services/auth-guard.service';
import { MetricsReportsComponent } from './metrics/reports/reports.component';

const desktop_routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'notifications', component: EmployeeNoticesDesktop },
  {path: 'scheduler',
    children: [
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
      {path: 'query', component: QueryComponent},
      {path: 'reports', component: ReportsSiteComponent },
      {path: '**', redirectTo: '/scheduler/schedule'}
    ]
  },
  {path: 'metrics',
    children: [
      { path: 'missions', component: MissionsHomeComponent },
      { path: 'outages', component: GroundOutageComponent },
      { path: 'reports', component: MetricsReportsComponent },
      { path: '**', redirectTo: '/metrics/missions'}
    ],
    canActivate: [AuthGuard]
  },
  {path: 'reset',
    children: [
      {path: 'start', component: ForgotPasswordComponent},
      {path: 'finish', component: ForgotPasswordResetComponent },
    ]
  },
  {path: 'admin', component: AdminComponent },
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
  {path: 'reset',
    children: [
      {path: 'start', component: ForgotPasswordComponent},
      {path: 'finish', component: ForgotPasswordResetComponent },
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
      {path: 'leaverequest', component: EmployeeLeaveRequestEditorComponent },
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
  {path: 'reset',
    children: [
      {path: 'start', component: ForgotPasswordComponent},
      {path: 'finish', component: ForgotPasswordResetComponent },
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
