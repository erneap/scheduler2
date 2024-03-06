import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditSpecialtyTypesComponent } from './team-editor-edit-specialty-types.component';

describe('TeamEditorEditSpecialtyTypesComponent', () => {
  let component: TeamEditorEditSpecialtyTypesComponent;
  let fixture: ComponentFixture<TeamEditorEditSpecialtyTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditSpecialtyTypesComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditSpecialtyTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
