import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOMonthDesktop } from './employee-ptoholidays-ptomonth.desktop';

describe('EmployeePTOHolidaysPTOMonthDesktop', () => {
  let component: EmployeePTOHolidaysPTOMonthDesktop;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOMonthDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOMonthDesktop]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOMonthDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
