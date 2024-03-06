import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleDayMobile } from './site-schedule-day.mobile';

describe('SiteScheduleDayMobile', () => {
  let component: SiteScheduleDayMobile;
  let fixture: ComponentFixture<SiteScheduleDayMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteScheduleDayMobile]
    });
    fixture = TestBed.createComponent(SiteScheduleDayMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
