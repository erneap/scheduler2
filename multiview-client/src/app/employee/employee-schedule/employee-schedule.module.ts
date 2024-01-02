import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeScheduleMonthTablet } from './employee-schedule-month/employee-schedule-month.tablet';
import { EmployeeScheduleMonthMobile } from './employee-schedule-month/employee-schedule-month.mobile';
import { EmployeeScheduleDayTablet } from './employee-schedule-day/employee-schedule-day.tablet';
import { EmployeeScheduleDayMobile } from './employee-schedule-day/employee-schedule-day.mobile';
import { EmployeeScheduleComponent } from './employee-schedule.component';
import { MaterialModule } from 'src/app/material.module';
import { EmployeeScheduleMonthComponent } from './employee-schedule-month/employee-schedule-month.component';
import { EmployeeScheduleDayComponent } from './employee-schedule-day/employee-schedule-day.component';



@NgModule({
  declarations: [
    EmployeeScheduleMonthTablet,
    EmployeeScheduleMonthMobile,
    EmployeeScheduleDayTablet,
    EmployeeScheduleDayMobile,
    EmployeeScheduleComponent,
    EmployeeScheduleMonthComponent,
    EmployeeScheduleDayComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    EmployeeScheduleMonthComponent,
    EmployeeScheduleMonthMobile,
    EmployeeScheduleMonthTablet
  ]
})
export class EmployeeScheduleModule { }
