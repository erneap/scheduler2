import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamEditorComponent } from './team-editor.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamEditorEditComponent } from './team-editor-edit/team-editor-edit.component';
import { TeamEditorSitesComponent } from './team-editor-sites/team-editor-sites.component';



@NgModule({
  declarations: [
    TeamEditorComponent,
    TeamEditorEditComponent,
    TeamEditorSitesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TeamEditorModule { }
