import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteScheduleModule } from './site-schedule/site-schedule.module';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    SiteScheduleModule
  ]
})
export class SiteModule { }
