import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorReportForecastComponent } from './site-editor-report-forecast.component';

describe('SiteEditorReportForecastComponent', () => {
  let component: SiteEditorReportForecastComponent;
  let fixture: ComponentFixture<SiteEditorReportForecastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorReportForecastComponent]
    });
    fixture = TestBed.createComponent(SiteEditorReportForecastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
