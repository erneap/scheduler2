import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeLeaveRequestDayComponent } from './employee-leave-request-day/employee-leave-request-day.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeLeaveRequestDayMobile } from './employee-leave-request-day/employee-leave-request-day.mobile';
import { EmployeeLeaveRequestDayTablet } from './employee-leave-request-day/employee-leave-request-day.tablet';
import { EmployeeLeaveRequestCalendarComponent } from './employee-leave-request-calendar/employee-leave-request-calendar.component';
import { EmployeeLeaveRequestCalendarTablet } from './employee-leave-request-calendar/employee-leave-request-calendar.tablet';
import { EmployeeLeaveRequestCalendarMobile } from './employee-leave-request-calendar/employee-leave-request-calendar.mobile';
import { EmployeeLeaveRequestEditorComponent } from './employee-leave-request-editor/employee-leave-request-editor.component';
import { EmployeeLeaveRequestEditorMobile } from './employee-leave-request-editor/employee-leave-request-editor.mobile';
import { EmployeeLeaveRequestEditorTablet } from './employee-leave-request-editor/employee-leave-request-editor.tablet';
import { EmployeeLeaveRequestDeletionDialogComponent } from './employee-leave-request-deletion-dialog/employee-leave-request-deletion-dialog.component';
import { EmployeeLeaveRequestUnapproveDialogComponent } from './employee-leave-request-unapprove-dialog/employee-leave-request-unapprove-dialog.component';
import { EmployeeLeaveRequestAvailabilityDayComponent } from './employee-leave-request-availability-day/employee-leave-request-availability-day.component';
import { EmployeeLeaveRequestAvailabilityDayMobile } from './employee-leave-request-availability-day/employee-leave-request-availability-day.mobile';
import { EmployeeLeaveRequestAvailabilityDayTablet } from './employee-leave-request-availability-day/employee-leave-request-availability-day.tablet';
import { EmployeeLeaveRequestAvailabilityCalendarComponent } from './employee-leave-request-availability-calendar/employee-leave-request-availability-calendar.component';
import { EmployeeLeaveRequestAvailabilityCalendarTablet } from './employee-leave-request-availability-calendar/employee-leave-request-availability-calendar.tablet';
import { EmployeeLeaveRequestAvailabilityCalendarMobile } from './employee-leave-request-availability-calendar/employee-leave-request-availability-calendar.mobile';
import { EmployeeLeaveRequestLegendComponent } from './employee-leave-request-legend/employee-leave-request-legend.component';
import { EmployeeLeaveRequestLegendMobile } from './employee-leave-request-legend/employee-leave-request-legend.mobile';
import { EmployeeLeaveRequestLegendTablet } from './employee-leave-request-legend/employee-leave-request-legend.tablet';



@NgModule({
  declarations: [
    EmployeeLeaveRequestDayComponent,
    EmployeeLeaveRequestDayMobile,
    EmployeeLeaveRequestDayTablet,
    EmployeeLeaveRequestCalendarComponent,
    EmployeeLeaveRequestCalendarTablet,
    EmployeeLeaveRequestCalendarMobile,
    EmployeeLeaveRequestEditorComponent,
    EmployeeLeaveRequestEditorMobile,
    EmployeeLeaveRequestEditorTablet,
    EmployeeLeaveRequestDeletionDialogComponent,
    EmployeeLeaveRequestUnapproveDialogComponent,
    EmployeeLeaveRequestAvailabilityDayComponent,
    EmployeeLeaveRequestAvailabilityDayMobile,
    EmployeeLeaveRequestAvailabilityDayTablet,
    EmployeeLeaveRequestAvailabilityCalendarComponent,
    EmployeeLeaveRequestAvailabilityCalendarTablet,
    EmployeeLeaveRequestAvailabilityCalendarMobile,
    EmployeeLeaveRequestLegendComponent,
    EmployeeLeaveRequestLegendMobile,
    EmployeeLeaveRequestLegendTablet
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EmployeeLeaveRequestAvailabilityCalendarComponent,
    EmployeeLeaveRequestAvailabilityCalendarMobile,
    EmployeeLeaveRequestCalendarComponent,
    EmployeeLeaveRequestCalendarMobile,
    EmployeeLeaveRequestEditorComponent,
    EmployeeLeaveRequestLegendComponent,
    EmployeeLeaveRequestLegendMobile,
    EmployeeLeaveRequestLegendTablet,
    EmployeeLeaveRequestUnapproveDialogComponent
  ]
})
export class EmployeeLeaveRequestModule { }
