import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayMobile } from './employee-ptoholidays-holiday.mobile';

describe('EmployeePTOHolidaysHolidayMobile', () => {
  let component: EmployeePTOHolidaysHolidayMobile;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayMobile]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
