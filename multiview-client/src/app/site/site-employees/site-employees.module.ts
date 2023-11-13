import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteEmployeesComponent } from './site-employees.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewEmployeeComponent } from './new-employee/new-employee.component';



@NgModule({
  declarations: [
    SiteEmployeesComponent,
    NewEmployeeComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SiteEmployeesModule { }
