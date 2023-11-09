import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestDayDesktop } from './employee-leave-request-day.desktop';

describe('EmployeeLeaveRequestDayDesktop', () => {
  let component: EmployeeLeaveRequestDayDesktop;
  let fixture: ComponentFixture<EmployeeLeaveRequestDayDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestDayDesktop]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestDayDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
