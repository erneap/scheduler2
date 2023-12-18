import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteEditorReportForecastLaborComponent } from './site-editor-report-forecast-labor.component';

describe('SiteEditorReportForecastLaborComponent', () => {
  let component: SiteEditorReportForecastLaborComponent;
  let fixture: ComponentFixture<SiteEditorReportForecastLaborComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteEditorReportForecastLaborComponent]
    });
    fixture = TestBed.createComponent(SiteEditorReportForecastLaborComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
