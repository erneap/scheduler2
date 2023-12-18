import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorReportsComponent } from './site-editor-reports.component';

describe('SiteEditorReportsComponent', () => {
  let component: SiteEditorReportsComponent;
  let fixture: ComponentFixture<SiteEditorReportsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorReportsComponent]
    });
    fixture = TestBed.createComponent(SiteEditorReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
