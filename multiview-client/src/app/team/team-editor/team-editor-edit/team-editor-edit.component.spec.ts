import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditComponent } from './team-editor-edit.component';

describe('TeamEditorEditComponent', () => {
  let component: TeamEditorEditComponent;
  let fixture: ComponentFixture<TeamEditorEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
