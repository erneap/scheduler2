import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityCalendarMobile } from './employee-leave-request-availability-calendar.mobile';

describe('EmployeeLeaveRequestAvailabilityCalendarMobile', () => {
  let component: EmployeeLeaveRequestAvailabilityCalendarMobile;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityCalendarMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityCalendarMobile]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityCalendarMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
