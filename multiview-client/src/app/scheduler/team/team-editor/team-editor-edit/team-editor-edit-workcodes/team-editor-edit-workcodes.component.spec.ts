import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorEditWorkcodesComponent } from './team-editor-edit-workcodes.component';

describe('TeamEditorEditWorkcodesComponent', () => {
  let component: TeamEditorEditWorkcodesComponent;
  let fixture: ComponentFixture<TeamEditorEditWorkcodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorEditWorkcodesComponent]
    });
    fixture = TestBed.createComponent(TeamEditorEditWorkcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
