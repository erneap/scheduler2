import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoverageShiftMobile } from './site-coverage-shift.mobile';

describe('SiteCoverageShiftMobile', () => {
  let component: SiteCoverageShiftMobile;
  let fixture: ComponentFixture<SiteCoverageShiftMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoverageShiftMobile]
    });
    fixture = TestBed.createComponent(SiteCoverageShiftMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
