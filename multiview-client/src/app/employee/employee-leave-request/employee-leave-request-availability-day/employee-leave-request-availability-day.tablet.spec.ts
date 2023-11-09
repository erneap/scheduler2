import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityDayTablet } from './employee-leave-request-availability-day.tablet';

describe('EmployeeLeaveRequestAvailabilityDayTablet', () => {
  let component: EmployeeLeaveRequestAvailabilityDayTablet;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityDayTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityDayTablet]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityDayTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
