import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamEditorComponent } from './team-editor.component';
import { MaterialModule } from 'src/app/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeamEditorEditComponent } from './team-editor-edit/team-editor-edit.component';
import { TeamEditorSitesComponent } from './team-editor-sites/team-editor-sites.component';
import { TeamEditorEditWorkcodesComponent } from './team-editor-edit/team-editor-edit-workcodes/team-editor-edit-workcodes.component';
import { TeamEditorEditCompaniesComponent } from './team-editor-edit/team-editor-edit-companies/team-editor-edit-companies.component';
import { TeamEditorEditContactTypesComponent } from './team-editor-edit/team-editor-edit-contact-types/team-editor-edit-contact-types.component';
import { TeamEditorEditSpecialtyTypesComponent } from './team-editor-edit/team-editor-edit-specialty-types/team-editor-edit-specialty-types.component';
import { TeamEditorEditWorkcodeComponent } from './team-editor-edit/team-editor-edit-workcode/team-editor-edit-workcode.component';
import { TeamEditorEditCompaniesCompanyComponent } from './team-editor-edit/team-editor-edit-companies/team-editor-edit-companies-company/team-editor-edit-companies-company.component';
import { TeamEditorEditCompaniesCompanyHolidaysComponent } from './team-editor-edit/team-editor-edit-companies/team-editor-edit-companies-company-holidays/team-editor-edit-companies-company-holidays.component';
import { TeamEditorEditContactTypeComponent } from './team-editor-edit/team-editor-edit-contact-types/team-editor-edit-contact-type/team-editor-edit-contact-type.component';
import { TeamEditorEditSpecialtyTypeComponent } from './team-editor-edit/team-editor-edit-specialty-types/team-editor-edit-specialty-type/team-editor-edit-specialty-type.component';
import { SiteModule } from 'src/app/scheduler/site/site.module';
import { SiteEditorModule } from 'src/app/scheduler/site/site-editor/site-editor.module';
import { TeamEditorSiteComponent } from './team-editor-sites/team-editor-site/team-editor-site.component';
import { SiteEmployeesModule } from 'src/app/scheduler/site/site-employees/site-employees.module';



@NgModule({
  declarations: [
    TeamEditorComponent,
    TeamEditorEditComponent,
    TeamEditorSitesComponent,
    TeamEditorEditWorkcodesComponent,
    TeamEditorEditCompaniesComponent,
    TeamEditorEditContactTypesComponent,
    TeamEditorEditSpecialtyTypesComponent,
    TeamEditorEditWorkcodeComponent,
    TeamEditorEditCompaniesCompanyComponent,
    TeamEditorEditCompaniesCompanyHolidaysComponent,
    TeamEditorEditContactTypeComponent,
    TeamEditorEditSpecialtyTypeComponent,
    TeamEditorSiteComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SiteModule,
    SiteEditorModule,
    SiteEmployeesModule
  ],
  exports: [
    TeamEditorComponent,
  ]
})
export class TeamEditorModule { }
