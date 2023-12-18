import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOMonthTablet } from './employee-ptoholidays-ptomonth.tablet';

describe('EmployeePTOHolidaysPTOMonthTablet', () => {
  let component: EmployeePTOHolidaysPTOMonthTablet;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOMonthTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOMonthTablet]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOMonthTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
