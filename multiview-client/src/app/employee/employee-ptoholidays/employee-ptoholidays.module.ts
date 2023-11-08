import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EmployeePTOHolidayChartComponent } from './employee-ptoholiday-chart/employee-ptoholiday-chart.component';
import { EmployeePTOHolidaysChartDesktop } from './employee-ptoholidays-chart/employee-ptoholidays-chart.desktop';
import { EmployeePTOHolidaysChartTablet } from './employee-ptoholidays-chart/employee-ptoholidays-chart.tablet';
import { EmployeePTOHolidaysChartMobile } from './employee-ptoholidays-chart/employee-ptoholidays-chart.mobile';
import { EmployeePTOHolidaysHolidayComponent } from './employee-ptoholidays-holiday/employee-ptoholidays-holiday.component';
import { EmployeePTOHolidaysPTOComponent } from './employee-ptoholidays-pto/employee-ptoholidays-pto.component';
import { EmployeePTOHolidaysHolidayDesktop } from './employee-ptoholidays-holiday/employee-ptoholidays-holiday.desktop';
import { EmployeePTOHolidaysHolidayTablet } from './employee-ptoholidays-holiday/employee-ptoholidays-holiday.tablet';
import { EmployeePTOHolidaysHolidayMobile } from './employee-ptoholidays-holiday/employee-ptoholidays-holiday.mobile';
import { EmployeePTOHolidaysPTODesktop } from './employee-ptoholidays-pto/employee-ptoholidays-pto.desktop';
import { EmployeePTOHolidaysPTOTablet } from './employee-ptoholidays-pto/employee-ptoholidays-pto.tablet';
import { EmployeePTOHolidaysPTOMobile } from './employee-ptoholidays-pto/employee-ptoholidays-pto.mobile';
import { EmployeePTOHolidaysPTOMonthComponent } from './employee-ptoholidays-ptomonth/employee-ptoholidays-ptomonth.component';
import { EmployeePTOHolidaysPTOMonthDesktop } from './employee-ptoholidays-ptomonth/employee-ptoholidays-ptomonth.desktop';
import { EmployeePTOHolidaysPTOMonthTablet } from './employee-ptoholidays-ptomonth/employee-ptoholidays-ptomonth.tablet';
import { EmployeePTOHolidaysPTOMonthMobile } from './employee-ptoholidays-ptomonth/employee-ptoholidays-ptomonth.mobile';
import { EmployeePTOHolidaysHolidayCellComponent } from './employee-ptoholidays-holiday-cell/employee-ptoholidays-holiday-cell.component';
import { EmployeePTOHolidaysHolidayCellDesktop } from './employee-ptoholidays-holiday-cell/employee-ptoholidays-holiday-cell.desktop';
import { EmployeePTOHolidaysHolidayCellMobile } from './employee-ptoholidays-holiday-cell/employee-ptoholidays-holiday-cell.mobile';
import { EmployeePTOHolidaysHolidayCellTablet } from './employee-ptoholidays-holiday-cell/employee-ptoholidays-holiday-cell.tablet';
import { EmployeePTOHolidaysHolidayCellDisplayComponent } from './employee-ptoholidays-holiday-cell-display/employee-ptoholidays-holiday-cell-display.component';
import { EmployeePTOHolidaysPTOMonthDisplayComponent } from './employee-ptoholidays-ptomonth-display/employee-ptoholidays-ptomonth-display.component';



@NgModule({
  declarations: [
    EmployeePTOHolidayChartComponent,
    EmployeePTOHolidaysChartDesktop,
    EmployeePTOHolidaysChartTablet,
    EmployeePTOHolidaysChartMobile,
    EmployeePTOHolidaysHolidayComponent,
    EmployeePTOHolidaysPTOComponent,
    EmployeePTOHolidaysHolidayDesktop,
    EmployeePTOHolidaysHolidayTablet,
    EmployeePTOHolidaysHolidayMobile,
    EmployeePTOHolidaysPTODesktop,
    EmployeePTOHolidaysPTOTablet,
    EmployeePTOHolidaysPTOMobile,
    EmployeePTOHolidaysPTOMonthComponent,
    EmployeePTOHolidaysPTOMonthDesktop,
    EmployeePTOHolidaysPTOMonthTablet,
    EmployeePTOHolidaysPTOMonthMobile,
    EmployeePTOHolidaysHolidayCellComponent,
    EmployeePTOHolidaysHolidayCellDesktop,
    EmployeePTOHolidaysHolidayCellMobile,
    EmployeePTOHolidaysHolidayCellTablet,
    EmployeePTOHolidaysHolidayCellDisplayComponent,
    EmployeePTOHolidaysPTOMonthDisplayComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports: [
    EmployeePTOHolidaysChartDesktop,
    EmployeePTOHolidaysChartTablet,
    EmployeePTOHolidaysChartMobile
  ]
})
export class EmployeePTOHolidaysModule { }
