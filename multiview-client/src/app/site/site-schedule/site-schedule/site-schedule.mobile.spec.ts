import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteScheduleMobile } from './site-schedule.mobile';

describe('SiteScheduleMobile', () => {
  let component: SiteScheduleMobile;
  let fixture: ComponentFixture<SiteScheduleMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteScheduleMobile]
    });
    fixture = TestBed.createComponent(SiteScheduleMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
