import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EmployeeSpecialtiesComponent } from './employee-specialties.component';
import { EmployeeSpecialtiesDesktop } from './employee-specialties.desktop';
import { EmployeeSpecialtiesMobile } from './employee-specialties.mobile';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EmployeeSpecialtiesComponent,
    EmployeeSpecialtiesDesktop,
    EmployeeSpecialtiesMobile
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployeeSpecialtiesModule { }
