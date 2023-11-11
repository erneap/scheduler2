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
import { SiteCoverageComponent } from './site-coverage/site-coverage.component';
import { SiteCoverageDayComponent } from './site-coverage/site-coverage-day/site-coverage-day.component';
import { SiteCoverageDayMobile } from './site-coverage/site-coverage-day/site-coverage-day.mobile';
import { SiteCoverageShiftComponent } from './site-coverage/site-coverage-shift/site-coverage-shift.component';
import { SiteCoverageShiftMobile } from './site-coverage/site-coverage-shift/site-coverage-shift.mobile';
import { SiteCoveragePeriodComponent } from './site-coverage/site-coverage-period/site-coverage-period.component';
import { SiteCoveragePeriodMobile } from './site-coverage/site-coverage-period/site-coverage-period.mobile';
import { SiteCoverageMobile } from './site-coverage/site-coverage.mobile';
import { SiteMidScheduleComponent } from './site-mid-schedule/site-mid-schedule.component';
import { SiteMidScheduleMobile } from './site-mid-schedule/site-mid-schedule.mobile';
import { SiteMidScheduleYearComponent } from './site-mid-schedule/site-mid-schedule-year/site-mid-schedule-year.component';

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
    SiteScheduleDayMobile,
    SiteCoverageComponent,
    SiteCoverageDayComponent,
    SiteCoverageDayMobile,
    SiteCoverageShiftComponent,
    SiteCoverageShiftMobile,
    SiteCoveragePeriodComponent,
    SiteCoveragePeriodMobile,
    SiteCoverageMobile,
    SiteMidScheduleComponent,
    SiteMidScheduleMobile,
    SiteMidScheduleYearComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmployeeLeaveRequestModule
  ]
})
export class SiteScheduleModule { }
