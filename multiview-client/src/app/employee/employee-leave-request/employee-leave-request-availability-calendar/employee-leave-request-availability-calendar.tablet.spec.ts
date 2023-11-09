import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityCalendarTablet } from './employee-leave-request-availability-calendar.tablet';

describe('EmployeeLeaveRequestAvailabilityCalendarTablet', () => {
  let component: EmployeeLeaveRequestAvailabilityCalendarTablet;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityCalendarTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityCalendarTablet]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityCalendarTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
