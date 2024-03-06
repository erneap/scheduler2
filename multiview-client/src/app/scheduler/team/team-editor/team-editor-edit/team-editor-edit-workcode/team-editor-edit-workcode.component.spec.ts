import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditWorkcodeComponent } from './team-editor-edit-workcode.component';

describe('TeamEditorEditWorkcodeComponent', () => {
  let component: TeamEditorEditWorkcodeComponent;
  let fixture: ComponentFixture<TeamEditorEditWorkcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditWorkcodeComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditWorkcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
