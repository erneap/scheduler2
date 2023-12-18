import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeletionConfirmationComponent } from './deletion-confirmation/deletion-confirmation.component';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [
    DeletionConfirmationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ]
})
export class GenericModule { }
