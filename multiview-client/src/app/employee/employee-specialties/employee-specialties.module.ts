import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { EmployeeSpecialtiesComponent } from './employee-specialties.component';
import { EmployeeSpecialtiesMobile } from './employee-specialties.mobile';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EmployeeSpecialtiesComponent,
    EmployeeSpecialtiesMobile
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    EmployeeSpecialtiesComponent,
  ]
})
export class EmployeeSpecialtiesModule { }
