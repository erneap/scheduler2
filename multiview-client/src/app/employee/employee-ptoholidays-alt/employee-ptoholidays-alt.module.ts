import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeePtoholidaysAltComponent } from './employee-ptoholidays-alt.component';
import { EmployeePtoholidaysAltPtoComponent } from './employee-ptoholidays-alt-pto/employee-ptoholidays-alt-pto.component';
import { EmployeePtoholidaysAltPtoCellComponent } from './employee-ptoholidays-alt-pto/employee-ptoholidays-alt-pto-cell/employee-ptoholidays-alt-pto-cell.component';
import { EmployeePtoholidaysAltPtoCellDisplayComponent } from './employee-ptoholidays-alt-pto/employee-ptoholidays-alt-pto-cell-display/employee-ptoholidays-alt-pto-cell-display.component';
import { MaterialModule } from 'src/app/material.module';
import { EmployeePtoholidaysAltHolidaysComponent } from './employee-ptoholidays-alt-holidays/employee-ptoholidays-alt-holidays.component';
import { EmployeePtoholidaysAltHolidaysCellDisplayComponent } from './employee-ptoholidays-alt-holidays/employee-ptoholidays-alt-holidays-cell-display/employee-ptoholidays-alt-holidays-cell-display.component';
import { EmployeePtoholidaysAltHolidaysCellComponent } from './employee-ptoholidays-alt-holidays/employee-ptoholidays-alt-holidays-cell/employee-ptoholidays-alt-holidays-cell.component';
import { EmployeePtoholidaysAltMobile } from './employee-ptoholidays-alt.mobile';



@NgModule({
  declarations: [
    EmployeePtoholidaysAltComponent,
    EmployeePtoholidaysAltPtoComponent,
    EmployeePtoholidaysAltPtoCellComponent,
    EmployeePtoholidaysAltPtoCellDisplayComponent,
    EmployeePtoholidaysAltHolidaysComponent,
    EmployeePtoholidaysAltHolidaysCellDisplayComponent,
    EmployeePtoholidaysAltHolidaysCellComponent,
    EmployeePtoholidaysAltMobile
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    EmployeePtoholidaysAltComponent
  ]
})
export class EmployeePtoholidaysAltModule { }
