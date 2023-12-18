import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOMonthMobile } from './employee-ptoholidays-ptomonth.mobile';

describe('EmployeePTOHolidaysPTOMonthMobile', () => {
  let component: EmployeePTOHolidaysPTOMonthMobile;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOMonthMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOMonthMobile]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOMonthMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
