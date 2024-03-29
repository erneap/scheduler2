import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamEditorModule } from './team-editor/team-editor.module';
import { MaterialModule } from '../../material.module';
import { AddTeamComponent } from './add-team/add-team.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    AddTeamComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    TeamEditorModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    AddTeamComponent,
  ]
})
export class TeamModule { }
