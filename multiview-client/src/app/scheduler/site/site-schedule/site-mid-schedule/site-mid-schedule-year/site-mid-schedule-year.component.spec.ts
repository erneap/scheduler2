import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMidScheduleYearComponent } from './site-mid-schedule-year.component';

describe('SiteMidScheduleYearComponent', () => {
  let component: SiteMidScheduleYearComponent;
  let fixture: ComponentFixture<SiteMidScheduleYearComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteMidScheduleYearComponent]
    });
    fixture = TestBed.createComponent(SiteMidScheduleYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
