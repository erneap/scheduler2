import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayDesktop } from './employee-ptoholidays-holiday.desktop';

describe('EmployeePTOHolidaysHolidayDesktop', () => {
  let component: EmployeePTOHolidaysHolidayDesktop;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayDesktop]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
