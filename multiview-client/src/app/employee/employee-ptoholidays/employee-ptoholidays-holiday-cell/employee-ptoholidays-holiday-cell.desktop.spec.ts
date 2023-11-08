import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayCellDesktop } from './employee-ptoholidays-holiday-cell.desktop';

describe('EmployeePTOHolidaysHolidayCellDesktop', () => {
  let component: EmployeePTOHolidaysHolidayCellDesktop;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayCellDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayCellDesktop]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayCellDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
