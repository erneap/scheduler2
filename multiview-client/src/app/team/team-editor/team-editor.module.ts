import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamEditorComponent } from './team-editor.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TeamEditorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TeamEditorModule { }
