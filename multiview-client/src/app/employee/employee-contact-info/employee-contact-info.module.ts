import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EmployeeContactInfoComponent } from './employee-contact-info.component';
import { EmployeeContactInfoItemComponent } from './employee-contact-info-item/employee-contact-info-item.component';
import { EmployeeContactInfoItemDesktop } from './employee-contact-info-item/employee-contact-info-item.desktop';
import { EmployeeContactInfoItemMobile } from './employee-contact-info-item/employee-contact-info-item.mobile';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeContactInfoDesktop } from './employee-contact-info.desktop';
import { EmployeeContactInfoMobile } from './employee-contact-info.mobile';
import { EmployeeContactInfoTablet } from './employee-contact-info.tablet';

@NgModule({
  declarations: [
    EmployeeContactInfoComponent,
    EmployeeContactInfoItemComponent,
    EmployeeContactInfoItemDesktop,
    EmployeeContactInfoItemMobile,
    EmployeeContactInfoDesktop,
    EmployeeContactInfoMobile,
    EmployeeContactInfoTablet
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployeeContactInfoModule { }
