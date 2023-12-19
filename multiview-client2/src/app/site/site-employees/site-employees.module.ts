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
import { EmployeeLeaveRequestModule } from 'src/app/employee/employee-leave-request/employee-leave-request.module';
import { SiteEmployeeLeaveEditorComponent } from './site-employee/site-employee-leave-editor/site-employee-leave-editor.component';
import { SiteEmployeeLeaveEditorRowComponent } from './site-employee/site-employee-leave-editor/site-employee-leave-editor-row/site-employee-leave-editor-row.component';
import { SiteEmployeeLeaveBalanceComponent } from './site-employee/site-employee-leave-balance/site-employee-leave-balance.component';
import { SiteEmployeeLeaveBalanceYearComponent } from './site-employee/site-employee-leave-balance/site-employee-leave-balance-year/site-employee-leave-balance-year.component';
import { SiteEmployeeLeaveBalanceDialogComponent } from './site-employee/site-employee-leave-balance/site-employee-leave-balance-dialog/site-employee-leave-balance-dialog.component';
import { EmployeeProfileModule } from 'src/app/employee/employee-profile/employee-profile.module';
import { EmployeeContactInfoModule } from 'src/app/employee/employee-contact-info/employee-contact-info.module';
import { EmployeeSpecialtiesModule } from 'src/app/employee/employee-specialties/employee-specialties.module';
import { SiteEmployeeAssignmentEditComponent } from './site-employee-assignment/site-employee-assignment-edit/site-employee-assignment-edit.component';
import { SiteEmployeeVariationsComponent } from './site-employee-variations/site-employee-variations.component';
import { SiteEmployeeVariationComponent } from './site-employee-variations/site-employee-variation/site-employee-variation.component';
import { SiteEmployeeProfileComponent } from './site-employee/site-employee-profile/site-employee-profile.component';
import { SiteEmployeeProfileUserAccountDialogComponent } from './site-employee/site-employee-profile/site-employee-profile-user-account-dialog/site-employee-profile-user-account-dialog.component';
import { EmployeePtoholidaysAltModule } from 'src/app/employee/employee-ptoholidays-alt/employee-ptoholidays-alt.module';
import { SiteEmployeeCompanyComponent } from './site-employee/site-employee-company/site-employee-company.component';

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
    SiteEmployeeLeaveBalanceDialogComponent,
    SiteEmployeeAssignmentEditComponent,
    SiteEmployeeVariationsComponent,
    SiteEmployeeVariationComponent,
    SiteEmployeeProfileComponent,
    SiteEmployeeProfileUserAccountDialogComponent,
    SiteEmployeeCompanyComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeLeaveRequestModule,
    EmployeeProfileModule,
    EmployeeContactInfoModule,
    EmployeeSpecialtiesModule,
    EmployeePtoholidaysAltModule
  ],
  exports: [
    SiteEmployeesComponent,
  ]
})
export class SiteEmployeesModule { }
