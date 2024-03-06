import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteMidScheduleMobile } from './site-mid-schedule.mobile';

describe('SiteMidScheduleMobile', () => {
  let component: SiteMidScheduleMobile;
  let fixture: ComponentFixture<SiteMidScheduleMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteMidScheduleMobile]
    });
    fixture = TestBed.createComponent(SiteMidScheduleMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
