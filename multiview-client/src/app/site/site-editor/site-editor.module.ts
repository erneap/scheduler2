import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SiteEditorComponent } from './site-editor.component';
import { SiteEditorBasicComponent } from './site-editor-basic/site-editor-basic.component';
import { SiteEditorWorkcenterComponent } from './site-editor-workcenter/site-editor-workcenter.component';
import { SiteEditorWorkcenterShiftComponent } from './site-editor-workcenter/site-editor-workcenter-shift/site-editor-workcenter-shift.component';
import { SiteEditorWorkcenterPositionComponent } from './site-editor-workcenter/site-editor-workcenter-position/site-editor-workcenter-position.component';
import { SiteEditorWorkcentersComponent } from './site-editor-workcenters/site-editor-workcenters.component';
import { SiteEditorReportsComponent } from './site-editor-reports/site-editor-reports.component';
import { SiteEditorReportForecastComponent } from './site-editor-reports/site-editor-report-forecast/site-editor-report-forecast.component';
import { SiteEditorReportCOFSComponent } from './site-editor-reports/site-editor-report-cofs/site-editor-report-cofs.component';

@NgModule({
  declarations: [
    SiteEditorComponent,
    SiteEditorBasicComponent,
    SiteEditorWorkcenterComponent,
    SiteEditorWorkcenterShiftComponent,
    SiteEditorWorkcenterPositionComponent,
    SiteEditorWorkcentersComponent,
    SiteEditorReportsComponent,
    SiteEditorReportForecastComponent,
    SiteEditorReportCOFSComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    SiteEditorComponent,
  ]
})
export class SiteEditorModule { }
