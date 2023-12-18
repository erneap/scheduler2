import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamEditorSiteComponent } from './team-editor-site.component';

describe('TeamEditorSiteComponent', () => {
  let component: TeamEditorSiteComponent;
  let fixture: ComponentFixture<TeamEditorSiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeamEditorSiteComponent]
    });
    fixture = TestBed.createComponent(TeamEditorSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
