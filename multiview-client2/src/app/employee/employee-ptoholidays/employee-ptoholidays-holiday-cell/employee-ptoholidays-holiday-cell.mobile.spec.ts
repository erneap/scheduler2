import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayCellMobile } from './employee-ptoholidays-holiday-cell.mobile';

describe('EmployeePTOHolidaysHolidayCellMobile', () => {
  let component: EmployeePTOHolidaysHolidayCellMobile;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayCellMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayCellMobile]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayCellMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
