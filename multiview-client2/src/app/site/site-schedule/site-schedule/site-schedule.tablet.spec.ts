import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleTablet } from './site-schedule.tablet';

describe('SiteScheduleTablet', () => {
  let component: SiteScheduleTablet;
  let fixture: ComponentFixture<SiteScheduleTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteScheduleTablet]
    });
    fixture = TestBed.createComponent(SiteScheduleTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
