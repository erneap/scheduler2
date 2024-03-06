import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EmployeeContactInfoComponent } from './employee-contact-info.component';
import { EmployeeContactInfoItemComponent } from './employee-contact-info-item/employee-contact-info-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EmployeeContactInfoMobile } from './employee-contact-info.mobile';

@NgModule({
  declarations: [
    EmployeeContactInfoComponent,
    EmployeeContactInfoItemComponent,
    EmployeeContactInfoMobile
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EmployeeContactInfoComponent,
  ]
})
export class EmployeeContactInfoModule { }
