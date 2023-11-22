import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamEditorModule } from './team-editor/team-editor.module';
import { MaterialModule } from '../material.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialModule,
    TeamEditorModule
  ]
})
export class TeamModule { }
