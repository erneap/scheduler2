import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteCoverageShiftComponent } from './site-coverage-shift.component';

describe('SiteCoverageShiftComponent', () => {
  let component: SiteCoverageShiftComponent;
  let fixture: ComponentFixture<SiteCoverageShiftComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SiteCoverageShiftComponent]
    });
    fixture = TestBed.createComponent(SiteCoverageShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
