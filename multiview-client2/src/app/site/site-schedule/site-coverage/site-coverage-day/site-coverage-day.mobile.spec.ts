import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoverageDayMobile } from './site-coverage-day.mobile';

describe('SiteCoverageDayMobile', () => {
  let component: SiteCoverageDayMobile;
  let fixture: ComponentFixture<SiteCoverageDayMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoverageDayMobile]
    });
    fixture = TestBed.createComponent(SiteCoverageDayMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
