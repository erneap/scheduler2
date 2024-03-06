import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditContactTypesComponent } from './team-editor-edit-contact-types.component';

describe('TeamEditorEditContactTypesComponent', () => {
  let component: TeamEditorEditContactTypesComponent;
  let fixture: ComponentFixture<TeamEditorEditContactTypesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditContactTypesComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditContactTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
