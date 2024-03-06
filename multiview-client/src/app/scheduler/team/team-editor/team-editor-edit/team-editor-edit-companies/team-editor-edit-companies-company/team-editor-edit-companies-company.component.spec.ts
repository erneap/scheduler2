import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditCompaniesCompanyComponent } from './team-editor-edit-companies-company.component';

describe('TeamEditorEditCompaniesCompanyComponent', () => {
  let component: TeamEditorEditCompaniesCompanyComponent;
  let fixture: ComponentFixture<TeamEditorEditCompaniesCompanyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditCompaniesCompanyComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditCompaniesCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
