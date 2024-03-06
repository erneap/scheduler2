import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditContactTypeComponent } from './team-editor-edit-contact-type.component';

describe('TeamEditorEditContactTypeComponent', () => {
  let component: TeamEditorEditContactTypeComponent;
  let fixture: ComponentFixture<TeamEditorEditContactTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditContactTypeComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditContactTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
