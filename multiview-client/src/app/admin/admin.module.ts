import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminTeamsEditorComponent } from './admin-teams-editor/admin-teams-editor.component';
import { AdminDataPurgeToolComponent } from './admin-data-purge-tool/admin-data-purge-tool.component';
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamModule } from '../team/team.module';
import { TeamEditorModule } from '../team/team-editor/team-editor.module';



@NgModule({
  declarations: [
    AdminComponent,
    AdminTeamsEditorComponent,
    AdminDataPurgeToolComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TeamModule,
    TeamEditorModule
  ]
})
export class AdminModule { }
