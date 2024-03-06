import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorWorkcenterPositionComponent } from './site-editor-workcenter-position.component';

describe('SiteEditorWorkcenterPositionComponent', () => {
  let component: SiteEditorWorkcenterPositionComponent;
  let fixture: ComponentFixture<SiteEditorWorkcenterPositionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorWorkcenterPositionComponent]
    });
    fixture = TestBed.createComponent(SiteEditorWorkcenterPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
