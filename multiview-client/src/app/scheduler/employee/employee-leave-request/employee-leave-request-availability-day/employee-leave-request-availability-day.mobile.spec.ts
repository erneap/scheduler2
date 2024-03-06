import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityDayMobile } from './employee-leave-request-availability-day.mobile';

describe('EmployeeLeaveRequestAvailabilityDayMobile', () => {
  let component: EmployeeLeaveRequestAvailabilityDayMobile;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityDayMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityDayMobile]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityDayMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
