import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryComponent } from './query.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QueryMobile } from './query.mobile';
import { QueryEmployeeContactsComponent } from './query-employee-contacts/query-employee-contacts.component';
import { QueryEmployeeSpecialtiesComponent } from './query-employee-specialties/query-employee-specialties.component';
import { QueryEmployeeContactsMobile } from './query-employee-contacts/query-employee-contacts.mobile';
import { QueryEmployeeSpecialtiesMobile } from './query-employee-specialties/query-employee-specialties.mobile';



@NgModule({
  declarations: [
    QueryComponent,
    QueryMobile,
    QueryEmployeeContactsComponent,
    QueryEmployeeSpecialtiesComponent,
    QueryEmployeeContactsMobile,
    QueryEmployeeSpecialtiesMobile
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class QueryModule { }
