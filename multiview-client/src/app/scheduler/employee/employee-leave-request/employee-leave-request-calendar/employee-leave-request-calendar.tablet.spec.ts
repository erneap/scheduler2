import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestCalendarTablet } from './employee-leave-request-calendar.tablet';

describe('EmployeeLeaveRequestCalendarTablet', () => {
  let component: EmployeeLeaveRequestCalendarTablet;
  let fixture: ComponentFixture<EmployeeLeaveRequestCalendarTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestCalendarTablet]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestCalendarTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
