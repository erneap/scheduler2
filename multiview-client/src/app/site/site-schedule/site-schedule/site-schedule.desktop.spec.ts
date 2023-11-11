import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleDesktop } from './site-schedule.desktop';

describe('SiteScheduleDesktop', () => {
  let component: SiteScheduleDesktop;
  let fixture: ComponentFixture<SiteScheduleDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteScheduleDesktop]
    });
    fixture = TestBed.createComponent(SiteScheduleDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
