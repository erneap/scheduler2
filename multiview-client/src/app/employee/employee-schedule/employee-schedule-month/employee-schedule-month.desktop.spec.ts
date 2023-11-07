import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleMonthDesktop } from './employee-schedule-month.desktop';

describe('EmployeeScheduleMonthDesktop', () => {
  let component: EmployeeScheduleMonthDesktop;
  let fixture: ComponentFixture<EmployeeScheduleMonthDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleMonthDesktop]
    });
    fixture = TestBed.createComponent(EmployeeScheduleMonthDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
