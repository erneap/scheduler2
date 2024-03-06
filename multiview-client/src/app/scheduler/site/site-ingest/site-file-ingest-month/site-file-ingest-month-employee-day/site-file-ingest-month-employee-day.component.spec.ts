import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFileIngestMonthEmployeeDayComponent } from './site-file-ingest-month-employee-day.component';

describe('SiteFileIngestMonthEmployeeDayComponent', () => {
  let component: SiteFileIngestMonthEmployeeDayComponent;
  let fixture: ComponentFixture<SiteFileIngestMonthEmployeeDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteFileIngestMonthEmployeeDayComponent]
    });
    fixture = TestBed.createComponent(SiteFileIngestMonthEmployeeDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
