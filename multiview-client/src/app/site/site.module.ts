import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteScheduleModule } from './site-schedule/site-schedule.module';
import { MaterialModule } from '../material.module';
import { SiteEmployeesModule } from './site-employees/site-employees.module';
import { SiteLeaveApprovalModule } from './site-leave-approval/site-leave-approval.module';
import { SiteEditorModule } from './site-editor/site-editor.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    SiteScheduleModule,
    SiteEmployeesModule,
    SiteEditorModule,
  ]
})
export class SiteModule { }
