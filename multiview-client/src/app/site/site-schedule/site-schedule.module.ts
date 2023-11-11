import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteScheduleComponent } from './site-schedule/site-schedule.component';
import { SiteScheduleDesktop } from './site-schedule/site-schedule.desktop';
import { SiteScheduleMobile } from './site-schedule/site-schedule.mobile';
import { SiteScheduleTablet } from './site-schedule/site-schedule.tablet';
import { SiteScheduleDayComponent } from './site-schedule/site-schedule-day/site-schedule-day.component';
import { SiteSchedulePeriodComponent } from './site-schedule/site-schedule-period/site-schedule-period.component';
import { MaterialModule } from 'src/app/material.module';
import { SiteScheduleRowComponent } from './site-schedule/site-schedule-row/site-schedule-row.component';
import { EmployeeLeaveRequestModule } from 'src/app/employee/employee-leave-request/employee-leave-request.module';
import { SiteSchedulePeriodMobile } from './site-schedule/site-schedule-period/site-schedule-period.mobile';
import { SiteScheduleRowMobile } from './site-schedule/site-schedule-row/site-schedule-row.mobile';
import { SiteScheduleDayMobile } from './site-schedule/site-schedule-day/site-schedule-day.mobile';

@NgModule({
  declarations: [
    SiteScheduleComponent,
    SiteScheduleDesktop,
    SiteScheduleMobile,
    SiteScheduleTablet,
    SiteScheduleDayComponent,
    SiteSchedulePeriodComponent,
    SiteScheduleRowComponent,
    SiteSchedulePeriodMobile,
    SiteScheduleRowMobile,
    SiteScheduleDayMobile
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmployeeLeaveRequestModule
  ]
})
export class SiteScheduleModule { }
