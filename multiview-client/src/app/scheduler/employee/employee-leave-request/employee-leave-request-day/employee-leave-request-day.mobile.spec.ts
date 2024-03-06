import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestDayMobile } from './employee-leave-request-day.mobile';

describe('EmployeeLeaveRequestDayMobile', () => {
  let component: EmployeeLeaveRequestDayMobile;
  let fixture: ComponentFixture<EmployeeLeaveRequestDayMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestDayMobile]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestDayMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
