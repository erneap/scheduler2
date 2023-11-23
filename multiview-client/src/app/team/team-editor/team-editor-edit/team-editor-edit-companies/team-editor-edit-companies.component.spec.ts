import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditCompaniesComponent } from './team-editor-edit-companies.component';

describe('TeamEditorEditCompaniesComponent', () => {
  let component: TeamEditorEditCompaniesComponent;
  let fixture: ComponentFixture<TeamEditorEditCompaniesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditCompaniesComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditCompaniesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
