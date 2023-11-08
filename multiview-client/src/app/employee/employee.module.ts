import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { EmployeeScheduleModule } from './employee-schedule/employee-schedule.module';
import { EmployeePTOHolidaysModule } from './employee-ptoholidays/employee-ptoholidays.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmployeeScheduleModule,
    EmployeePTOHolidaysModule
  ]
})
export class EmployeeModule { }
