import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleRowMobile } from './site-schedule-row.mobile';

describe('SiteScheduleRowMobile', () => {
  let component: SiteScheduleRowMobile;
  let fixture: ComponentFixture<SiteScheduleRowMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteScheduleRowMobile]
    });
    fixture = TestBed.createComponent(SiteScheduleRowMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
