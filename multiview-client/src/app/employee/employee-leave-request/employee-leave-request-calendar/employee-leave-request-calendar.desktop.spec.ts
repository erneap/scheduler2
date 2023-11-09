import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestCalendarDesktop } from './employee-leave-request-calendar.desktop';

describe('EmployeeLeaveRequestCalendarDesktop', () => {
  let component: EmployeeLeaveRequestCalendarDesktop;
  let fixture: ComponentFixture<EmployeeLeaveRequestCalendarDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestCalendarDesktop]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestCalendarDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
