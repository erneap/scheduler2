import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteSchedulePeriodMobile } from './site-schedule-period.mobile';

describe('SiteSchedulePeriodMobile', () => {
  let component: SiteSchedulePeriodMobile;
  let fixture: ComponentFixture<SiteSchedulePeriodMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteSchedulePeriodMobile]
    });
    fixture = TestBed.createComponent(SiteSchedulePeriodMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
