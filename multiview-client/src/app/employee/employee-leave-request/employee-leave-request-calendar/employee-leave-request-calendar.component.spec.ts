import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestCalendarComponent } from './employee-leave-request-calendar.component';

describe('EmployeeLeaveRequestCalendarComponent', () => {
  let component: EmployeeLeaveRequestCalendarComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestCalendarComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
