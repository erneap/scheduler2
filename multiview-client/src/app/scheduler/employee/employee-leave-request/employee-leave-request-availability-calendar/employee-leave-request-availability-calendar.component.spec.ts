import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityCalendarComponent } from './employee-leave-request-availability-calendar.component';

describe('EmployeeLeaveRequestAvailabilityCalendarComponent', () => {
  let component: EmployeeLeaveRequestAvailabilityCalendarComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityCalendarComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
