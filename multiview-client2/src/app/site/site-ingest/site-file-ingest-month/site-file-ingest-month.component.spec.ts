import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFileIngestMonthComponent } from './site-file-ingest-month.component';

describe('SiteFileIngestMonthComponent', () => {
  let component: SiteFileIngestMonthComponent;
  let fixture: ComponentFixture<SiteFileIngestMonthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteFileIngestMonthComponent]
    });
    fixture = TestBed.createComponent(SiteFileIngestMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
