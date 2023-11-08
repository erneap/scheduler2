import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayTablet } from './employee-ptoholidays-holiday.tablet';

describe('EmployeePTOHolidaysHolidayTablet', () => {
  let component: EmployeePTOHolidaysHolidayTablet;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayTablet]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
