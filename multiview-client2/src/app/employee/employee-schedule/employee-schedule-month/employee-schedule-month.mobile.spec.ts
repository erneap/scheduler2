import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleMonthMobile } from './employee-schedule-month.mobile';

describe('EmployeeScheduleMonthMobile', () => {
  let component: EmployeeScheduleMonthMobile;
  let fixture: ComponentFixture<EmployeeScheduleMonthMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleMonthMobile]
    });
    fixture = TestBed.createComponent(EmployeeScheduleMonthMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
