import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoveragePeriodMobile } from './site-coverage-period.mobile';

describe('SiteCoveragePeriodMobile', () => {
  let component: SiteCoveragePeriodMobile;
  let fixture: ComponentFixture<SiteCoveragePeriodMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoveragePeriodMobile]
    });
    fixture = TestBed.createComponent(SiteCoveragePeriodMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
