import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeProfileComponent } from './employee-profile.component';
import { EmployeeProfileDesktop } from './employee-profile.desktop';
import { EmployeeProfileMobile } from './employee-profile.mobile';
import { EmployeeProfileTablet } from './employee-profile.tablet';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EmployeeProfileComponent,
    EmployeeProfileDesktop,
    EmployeeProfileMobile,
    EmployeeProfileTablet
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EmployeeProfileDesktop
  ]
})
export class EmployeeProfileModule { }
