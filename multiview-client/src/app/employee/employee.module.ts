import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { EmployeeScheduleModule } from './employee-schedule/employee-schedule.module';
import { EmployeePTOHolidaysModule } from './employee-ptoholidays/employee-ptoholidays.module';
import { EmployeeProfileModule } from './employee-profile/employee-profile.module';
import { EmployeeLeaveRequestModule } from './employee-leave-request/employee-leave-request.module';
import { EmployeeNoticesModule } from './employee-notices/employee-notices.module';
import { EmployeeContactInfoModule } from './employee-contact-info/employee-contact-info.module';
import { EmployeeSpecialtiesModule } from './employee-specialties/employee-specialties.module';
import { EmployeePtoholidaysAltModule } from './employee-ptoholidays-alt/employee-ptoholidays-alt.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    MaterialModule,
    EmployeeScheduleModule,
    EmployeePTOHolidaysModule,
    EmployeeProfileModule,
    EmployeeLeaveRequestModule,
    EmployeeNoticesModule,
    EmployeeContactInfoModule,
    EmployeeSpecialtiesModule,
    EmployeePtoholidaysAltModule
  ]
})
export class EmployeeModule { }
