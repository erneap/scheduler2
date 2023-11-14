import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteEmployeesComponent } from './site-employees.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewEmployeeComponent } from './new-employee/new-employee.component';
import { SiteEmployeeAssignmentComponent } from './site-employee-assignment/site-employee-assignment.component';
import { SiteEmployeeAssignmentScheduleComponent } from './site-employee-assignment/site-employee-assignment-schedule/site-employee-assignment-schedule.component';
import { SiteEmployeeAssignmentScheduleDayComponent } from './site-employee-assignment/site-employee-assignment-schedule-day/site-employee-assignment-schedule-day.component';
import { SiteEmployeeComponent } from './site-employee/site-employee.component';
import { EmployeeModule } from 'src/app/employee/employee.module';
import { EmployeePTOHolidaysModule } from 'src/app/employee/employee-ptoholidays/employee-ptoholidays.module';
import { EmployeeLeaveRequestModule } from 'src/app/employee/employee-leave-request/employee-leave-request.module';
import { SiteEmployeeLeaveEditorComponent } from './site-employee/site-employee-leave-editor/site-employee-leave-editor.component';
import { SiteEmployeeLeaveEditorRowComponent } from './site-employee/site-employee-leave-editor/site-employee-leave-editor-row/site-employee-leave-editor-row.component';
import { SiteEmployeeLeaveBalanceComponent } from './site-employee/site-employee-leave-balance/site-employee-leave-balance.component';
import { SiteEmployeeLeaveBalanceYearComponent } from './site-employee/site-employee-leave-balance/site-employee-leave-balance-year/site-employee-leave-balance-year.component';
import { SiteEmployeeLeaveBalanceDialogComponent } from './site-employee/site-employee-leave-balance/site-employee-leave-balance-dialog/site-employee-leave-balance-dialog.component';



@NgModule({
  declarations: [
    SiteEmployeesComponent,
    NewEmployeeComponent,
    SiteEmployeeAssignmentComponent,
    SiteEmployeeAssignmentScheduleComponent,
    SiteEmployeeAssignmentScheduleDayComponent,
    SiteEmployeeComponent,
    SiteEmployeeLeaveEditorComponent,
    SiteEmployeeLeaveEditorRowComponent,
    SiteEmployeeLeaveBalanceComponent,
    SiteEmployeeLeaveBalanceYearComponent,
    SiteEmployeeLeaveBalanceDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeePTOHolidaysModule,
    EmployeeLeaveRequestModule
  ]
})
export class SiteEmployeesModule { }
