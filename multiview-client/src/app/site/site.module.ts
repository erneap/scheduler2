import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteScheduleModule } from './site-schedule/site-schedule.module';
import { MaterialModule } from '../material.module';
import { SiteEmployeesModule } from './site-employees/site-employees.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    SiteScheduleModule,
    SiteEmployeesModule
  ]
})
export class SiteModule { }
