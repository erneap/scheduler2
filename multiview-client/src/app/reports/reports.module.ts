import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsSiteComponent } from './reports-site/reports-site.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsSiteScheduleComponent } from './reports-site/reports-site-schedule/reports-site-schedule.component';
import { ReportsSiteLeaveListComponent } from './reports-site/reports-site-leave-list/reports-site-leave-list.component';
import { ReportsSiteChargeNumberComponent } from './reports-site/reports-site-charge-number/reports-site-charge-number.component';
import { ReportsSiteMidShiftComponent } from './reports-site/reports-site-mid-shift/reports-site-mid-shift.component';
import { ReportsSiteCertOfServiceComponent } from './reports-site/reports-site-cert-of-service/reports-site-cert-of-service.component';
import { ReportsSiteEnterpriseComponent } from './reports-site/reports-site-enterprise/reports-site-enterprise.component';



@NgModule({
  declarations: [
    ReportsSiteComponent,
    ReportsSiteScheduleComponent,
    ReportsSiteLeaveListComponent,
    ReportsSiteChargeNumberComponent,
    ReportsSiteMidShiftComponent,
    ReportsSiteCertOfServiceComponent,
    ReportsSiteEnterpriseComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
