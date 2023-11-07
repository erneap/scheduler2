import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleMonthTablet } from './employee-schedule-month.tablet';

describe('EmployeeScheduleMonthTablet', () => {
  let component: EmployeeScheduleMonthTablet;
  let fixture: ComponentFixture<EmployeeScheduleMonthTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleMonthTablet]
    });
    fixture = TestBed.createComponent(EmployeeScheduleMonthTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
