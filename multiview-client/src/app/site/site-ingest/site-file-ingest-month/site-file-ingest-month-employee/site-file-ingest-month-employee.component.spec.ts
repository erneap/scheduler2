import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteFileIngestMonthEmployeeComponent } from './site-file-ingest-month-employee.component';

describe('SiteFileIngestMonthEmployeeComponent', () => {
  let component: SiteFileIngestMonthEmployeeComponent;
  let fixture: ComponentFixture<SiteFileIngestMonthEmployeeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteFileIngestMonthEmployeeComponent]
    });
    fixture = TestBed.createComponent(SiteFileIngestMonthEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
