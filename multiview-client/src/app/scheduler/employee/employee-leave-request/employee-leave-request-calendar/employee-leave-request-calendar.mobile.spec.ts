import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestCalendarMobile } from './employee-leave-request-calendar.mobile';

describe('EmployeeLeaveRequestCalendarMobile', () => {
  let component: EmployeeLeaveRequestCalendarMobile;
  let fixture: ComponentFixture<EmployeeLeaveRequestCalendarMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestCalendarMobile]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestCalendarMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
