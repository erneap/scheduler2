import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GroundOutageListComponent } from './ground-outage/ground-outage-list/ground-outage-list.component';
import { GroundOutageItemComponent } from './ground-outage/ground-outage-item/ground-outage-item.component';
import { MaterialModule } from '../material.module';
import { MissionsModule } from './missions/missions.module';
import { ReportsModule } from '../reports/reports.module';
import { GroundOutageComponent } from './ground-outage/ground-outage.component';

@NgModule({
  declarations: [
    GroundOutageItemComponent,
    GroundOutageListComponent,
    GroundOutageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    MissionsModule,
    ReportsModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MetricsModule { }
