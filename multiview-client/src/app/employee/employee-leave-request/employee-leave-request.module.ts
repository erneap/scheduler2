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
    EmployeeLeaveRequestEditorTablet
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployeeLeaveRequestModule { }
