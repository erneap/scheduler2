import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestAvailabilityDayComponent } from './employee-leave-request-availability-day.component';

describe('EmployeeLeaveRequestAvailabilityDayComponent', () => {
  let component: EmployeeLeaveRequestAvailabilityDayComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestAvailabilityDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestAvailabilityDayComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestAvailabilityDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
