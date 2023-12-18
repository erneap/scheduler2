import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditSpecialtyTypeComponent } from './team-editor-edit-specialty-type.component';

describe('TeamEditorEditSpecialtyTypeComponent', () => {
  let component: TeamEditorEditSpecialtyTypeComponent;
  let fixture: ComponentFixture<TeamEditorEditSpecialtyTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditSpecialtyTypeComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditSpecialtyTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
