import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFileIngestMonthLegendCodeComponent } from './site-file-ingest-month-legend-code.component';

describe('SiteFileIngestMonthLegendCodeComponent', () => {
  let component: SiteFileIngestMonthLegendCodeComponent;
  let fixture: ComponentFixture<SiteFileIngestMonthLegendCodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteFileIngestMonthLegendCodeComponent]
    });
    fixture = TestBed.createComponent(SiteFileIngestMonthLegendCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
