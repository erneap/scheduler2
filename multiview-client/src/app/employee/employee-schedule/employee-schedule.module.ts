import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeScheduleMonthDesktop } from './employee-schedule-month/employee-schedule-month.desktop';
import { EmployeeScheduleMonthTablet } from './employee-schedule-month/employee-schedule-month.tablet';
import { EmployeeScheduleMonthMobile } from './employee-schedule-month/employee-schedule-month.mobile';
import { EmployeeScheduleDayDesktop } from './employee-schedule-day/employee-schedule-day.desktop';
import { EmployeeScheduleDayTablet } from './employee-schedule-day/employee-schedule-day.tablet';
import { EmployeeScheduleDayMobile } from './employee-schedule-day/employee-schedule-day.mobile';



@NgModule({
  declarations: [
    EmployeeScheduleMonthDesktop,
    EmployeeScheduleMonthTablet,
    EmployeeScheduleMonthMobile,
    EmployeeScheduleDayDesktop,
    EmployeeScheduleDayTablet,
    EmployeeScheduleDayMobile
  ],
  imports: [
    CommonModule
  ]
})
export class EmployeeScheduleModule { }
