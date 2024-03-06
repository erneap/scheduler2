import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReviewSensorComponent } from './review-sensor/review-sensor.component';
import { ReviewMissionComponent } from './review-mission/review-mission.component';
import { ReviewSensorsComponent } from './review-sensors/review-sensors.component';
import { ReviewDayComponent } from './review-day/review-day.component';
import { ReviewComponent } from './review/review.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { MetricsReportsComponent } from './reports.component';


@NgModule({
  declarations: [
    ReviewSensorComponent,
    ReviewSensorsComponent,
    ReviewMissionComponent,
    ReviewDayComponent,
    ReviewComponent,
    MetricsReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MetricsReportsModule { }
