import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMidScheduleYearMobile } from './site-mid-schedule-year.mobile';

describe('SiteMidScheduleYearMobile', () => {
  let component: SiteMidScheduleYearMobile;
  let fixture: ComponentFixture<SiteMidScheduleYearMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteMidScheduleYearMobile]
    });
    fixture = TestBed.createComponent(SiteMidScheduleYearMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
