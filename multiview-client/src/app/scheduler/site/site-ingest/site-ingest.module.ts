import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteFileIngestComponent } from './site-file-ingest/site-file-ingest.component';
import { SiteFileIngestMonthComponent } from './site-file-ingest-month/site-file-ingest-month.component';
import { SiteFileIngestMonthEmployeeComponent } from './site-file-ingest-month/site-file-ingest-month-employee/site-file-ingest-month-employee.component';
import { SiteFileIngestMonthEmployeeDayComponent } from './site-file-ingest-month/site-file-ingest-month-employee-day/site-file-ingest-month-employee-day.component';
import { SiteFileIngestMonthLegendComponent } from './site-file-ingest-month/site-file-ingest-month-legend/site-file-ingest-month-legend.component';
import { SiteFileIngestMonthLegendCodeComponent } from './site-file-ingest-month/site-file-ingest-month-legend-code/site-file-ingest-month-legend-code.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SiteFileIngestComponent,
    SiteFileIngestMonthComponent,
    SiteFileIngestMonthEmployeeComponent,
    SiteFileIngestMonthEmployeeDayComponent,
    SiteFileIngestMonthLegendComponent,
    SiteFileIngestMonthLegendCodeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [SiteFileIngestComponent]
})
export class SiteIngestModule { }
