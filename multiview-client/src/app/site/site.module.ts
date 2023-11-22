import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteScheduleModule } from './site-schedule/site-schedule.module';
import { MaterialModule } from '../material.module';
import { SiteEmployeesModule } from './site-employees/site-employees.module';
import { SiteLeaveApprovalModule } from './site-leave-approval/site-leave-approval.module';
import { SiteEditorModule } from './site-editor/site-editor.module';
import { AddSiteComponent } from './add-site/add-site.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SiteIngestModule } from './site-ingest/site-ingest.module';



@NgModule({
  declarations: [
    AddSiteComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SiteScheduleModule,
    SiteEmployeesModule,
    SiteEditorModule,
    SiteLeaveApprovalModule,
    FormsModule,
    ReactiveFormsModule,
    SiteIngestModule
  ],
  exports: [
    AddSiteComponent,
  ]
})
export class SiteModule { }
