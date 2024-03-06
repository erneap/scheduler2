import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorReportCOFSComponent } from './site-editor-report-cofs.component';

describe('SiteEditorReportCOFSComponent', () => {
  let component: SiteEditorReportCOFSComponent;
  let fixture: ComponentFixture<SiteEditorReportCOFSComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorReportCOFSComponent]
    });
    fixture = TestBed.createComponent(SiteEditorReportCOFSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
