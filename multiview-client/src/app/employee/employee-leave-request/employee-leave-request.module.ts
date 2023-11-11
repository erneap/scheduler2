import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeLeaveRequestDayComponent } from './employee-leave-request-day/employee-leave-request-day.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeLeaveRequestDayDesktop } from './employee-leave-request-day/employee-leave-request-day.desktop';
import { EmployeeLeaveRequestDayMobile } from './employee-leave-request-day/employee-leave-request-day.mobile';
import { EmployeeLeaveRequestDayTablet } from './employee-leave-request-day/employee-leave-request-day.tablet';
import { EmployeeLeaveRequestCalendarComponent } from './employee-leave-request-calendar/employee-leave-request-calendar.component';
import { EmployeeLeaveRequestCalendarTablet } from './employee-leave-request-calendar/employee-leave-request-calendar.tablet';
import { EmployeeLeaveRequestCalendarMobile } from './employee-leave-request-calendar/employee-leave-request-calendar.mobile';
import { EmployeeLeaveRequestCalendarDesktop } from './employee-leave-request-calendar/employee-leave-request-calendar.desktop';
import { EmployeeLeaveRequestEditorComponent } from './employee-leave-request-editor/employee-leave-request-editor.component';
import { EmployeeLeaveRequestEditorDesktop } from './employee-leave-request-editor/employee-leave-request-editor.desktop';
import { EmployeeLeaveRequestEditorMobile } from './employee-leave-request-editor/employee-leave-request-editor.mobile';
import { EmployeeLeaveRequestEditorTablet } from './employee-leave-request-editor/employee-leave-request-editor.tablet';
import { EmployeeLeaveRequestDeletionDialogComponent } from './employee-leave-request-deletion-dialog/employee-leave-request-deletion-dialog.component';
import { EmployeeLeaveRequestUnapproveDialogComponent } from './employee-leave-request-unapprove-dialog/employee-leave-request-unapprove-dialog.component';
import { EmployeeLeaveRequestAvailabilityDayComponent } from './employee-leave-request-availability-day/employee-leave-request-availability-day.component';
import { EmployeeLeaveRequestAvailabilityDayDesktop } from './employee-leave-request-availability-day/employee-leave-request-availability-day.desktop';
import { EmployeeLeaveRequestAvailabilityDayMobile } from './employee-leave-request-availability-day/employee-leave-request-availability-day.mobile';
import { EmployeeLeaveRequestAvailabilityDayTablet } from './employee-leave-request-availability-day/employee-leave-request-availability-day.tablet';
import { EmployeeLeaveRequestAvailabilityCalendarComponent } from './employee-leave-request-availability-calendar/employee-leave-request-availability-calendar.component';
import { EmployeeLeaveRequestAvailabilityCalendarTablet } from './employee-leave-request-availability-calendar/employee-leave-request-availability-calendar.tablet';
import { EmployeeLeaveRequestAvailabilityCalendarMobile } from './employee-leave-request-availability-calendar/employee-leave-request-availability-calendar.mobile';
import { EmployeeLeaveRequestAvailabilityCalendarDesktop } from './employee-leave-request-availability-calendar/employee-leave-request-availability-calendar.desktop';
import { EmployeeLeaveRequestLegendComponent } from './employee-leave-request-legend/employee-leave-request-legend.component';
import { EmployeeLeaveRequestLegendDesktop } from './employee-leave-request-legend/employee-leave-request-legend.desktop';
import { EmployeeLeaveRequestLegendMobile } from './employee-leave-request-legend/employee-leave-request-legend.mobile';
import { EmployeeLeaveRequestLegendTablet } from './employee-leave-request-legend/employee-leave-request-legend.tablet';



@NgModule({
  declarations: [
    EmployeeLeaveRequestDayComponent,
    EmployeeLeaveRequestDayDesktop,
    EmployeeLeaveRequestDayMobile,
    EmployeeLeaveRequestDayTablet,
    EmployeeLeaveRequestCalendarComponent,
    EmployeeLeaveRequestCalendarTablet,
    EmployeeLeaveRequestCalendarMobile,
    EmployeeLeaveRequestCalendarDesktop,
    EmployeeLeaveRequestEditorComponent,
    EmployeeLeaveRequestEditorDesktop,
    EmployeeLeaveRequestEditorMobile,
    EmployeeLeaveRequestEditorTablet,
    EmployeeLeaveRequestDeletionDialogComponent,
    EmployeeLeaveRequestUnapproveDialogComponent,
    EmployeeLeaveRequestAvailabilityDayComponent,
    EmployeeLeaveRequestAvailabilityDayDesktop,
    EmployeeLeaveRequestAvailabilityDayMobile,
    EmployeeLeaveRequestAvailabilityDayTablet,
    EmployeeLeaveRequestAvailabilityCalendarComponent,
    EmployeeLeaveRequestAvailabilityCalendarTablet,
    EmployeeLeaveRequestAvailabilityCalendarMobile,
    EmployeeLeaveRequestAvailabilityCalendarDesktop,
    EmployeeLeaveRequestLegendComponent,
    EmployeeLeaveRequestLegendDesktop,
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
    EmployeeLeaveRequestLegendDesktop,
    EmployeeLeaveRequestLegendMobile,
    EmployeeLeaveRequestLegendTablet
  ]
})
export class EmployeeLeaveRequestModule { }
