import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EmployeeNoticesComponent } from './employee-notices.component';
import { EmployeeNoticesMessageComponent } from './employee-notices-message/employee-notices-message.component';
import { EmployeeNoticesMessageDesktop } from './employee-notices-message/employee-notices-message.desktop';
import { EmployeeNoticesMessageMobile } from './employee-notices-message/employee-notices-message.mobile';
import { EmployeeNoticesMessageTablet } from './employee-notices-message/employee-notices-message.tablet';
import { EmployeeNoticesTablet } from './employee-notices.tablet';
import { EmployeeNoticesMobile } from './employee-notices.mobile';
import { EmployeeNoticesDesktop } from './employee-notices.desktop';

@NgModule({
  declarations: [
    EmployeeNoticesComponent,
    EmployeeNoticesMessageComponent,
    EmployeeNoticesMessageDesktop,
    EmployeeNoticesMessageMobile,
    EmployeeNoticesMessageTablet,
    EmployeeNoticesTablet,
    EmployeeNoticesMobile,
    EmployeeNoticesDesktop
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class EmployeeNoticesModule { }
