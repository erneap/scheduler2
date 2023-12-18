import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorWorkcenterComponent } from './site-editor-workcenter.component';

describe('SiteEditorWorkcenterComponent', () => {
  let component: SiteEditorWorkcenterComponent;
  let fixture: ComponentFixture<SiteEditorWorkcenterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorWorkcenterComponent]
    });
    fixture = TestBed.createComponent(SiteEditorWorkcenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
