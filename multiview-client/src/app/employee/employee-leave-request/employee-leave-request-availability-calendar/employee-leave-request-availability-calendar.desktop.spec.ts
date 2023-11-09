import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityCalendarDesktop } from './employee-leave-request-availability-calendar.desktop';

describe('EmployeeLeaveRequestAvailabilityCalendarDesktop', () => {
  let component: EmployeeLeaveRequestAvailabilityCalendarDesktop;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityCalendarDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityCalendarDesktop]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityCalendarDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
