import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFileIngestMonthLegendComponent } from './site-file-ingest-month-legend.component';

describe('SiteFileIngestMonthLegendComponent', () => {
  let component: SiteFileIngestMonthLegendComponent;
  let fixture: ComponentFixture<SiteFileIngestMonthLegendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteFileIngestMonthLegendComponent]
    });
    fixture = TestBed.createComponent(SiteFileIngestMonthLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
