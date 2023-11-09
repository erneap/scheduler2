import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityDayDesktop } from './employee-leave-request-availability-day.desktop';

describe('EmployeeLeaveRequestAvailabilityDayDesktop', () => {
  let component: EmployeeLeaveRequestAvailabilityDayDesktop;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityDayDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityDayDesktop]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityDayDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
