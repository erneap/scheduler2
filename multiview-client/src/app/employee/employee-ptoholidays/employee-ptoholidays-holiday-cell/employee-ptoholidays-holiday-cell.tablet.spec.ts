import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayCellTablet } from './employee-ptoholidays-holiday-cell.tablet';

describe('EmployeePTOHolidaysHolidayCellTablet', () => {
  let component: EmployeePTOHolidaysHolidayCellTablet;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayCellTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayCellTablet]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayCellTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
