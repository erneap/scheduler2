import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeScheduleComponent } from './employee-schedule/employee-schedule.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [
    EmployeeScheduleComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EmployeeModule { }
