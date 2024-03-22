import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteScheduleComponent } from './site-schedule/site-schedule.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SiteScheduleMonthComponent } from './site-schedule/site-schedule-month/site-schedule-month.component';
import { SiteScheduleMonthDayComponent } from './site-schedule/site-schedule-month/site-schedule-month-day/site-schedule-month-day.component';
import { SiteScheduleMonthOfficeComponent } from './site-schedule/site-schedule-month/site-schedule-month-office/site-schedule-month-office.component';
import { SiteScheduleMonthDaysComponent } from './site-schedule/site-schedule-month/site-schedule-month-days/site-schedule-month-days.component';
import { SiteScheduleLegendComponent } from './site-schedule/site-schedule-legend/site-schedule-legend.component';
import { SiteScheduleLegendCodeComponent } from './site-schedule/site-schedule-legend/site-schedule-legend-code/site-schedule-legend-code.component';


@NgModule({
  declarations: [
    SiteScheduleComponent,
    SiteScheduleMonthComponent,
    SiteScheduleMonthDayComponent,
    SiteScheduleMonthOfficeComponent,
    SiteScheduleMonthDaysComponent,
    SiteScheduleLegendComponent,
    SiteScheduleLegendCodeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SiteScheduleComponent
  ]
})
export class SiteScheduleModule { }
