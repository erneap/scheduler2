import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditCompaniesCompanyHolidaysComponent } from './team-editor-edit-companies-company-holidays.component';

describe('TeamEditorEditCompaniesCompanyHolidaysComponent', () => {
  let component: TeamEditorEditCompaniesCompanyHolidaysComponent;
  let fixture: ComponentFixture<TeamEditorEditCompaniesCompanyHolidaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditCompaniesCompanyHolidaysComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditCompaniesCompanyHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
