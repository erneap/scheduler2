import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteLeaveApprovalComponent } from './site-leave-approval.component';
import { SiteLeaveApprovalMobile } from './site-leave-approval.mobile';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeLeaveRequestModule } from 'src/app/employee/employee-leave-request/employee-leave-request.module';

@NgModule({
  declarations: [
    SiteLeaveApprovalComponent,
    SiteLeaveApprovalMobile
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    EmployeeLeaveRequestModule
  ]
})
export class SiteLeaveApprovalModule { }
