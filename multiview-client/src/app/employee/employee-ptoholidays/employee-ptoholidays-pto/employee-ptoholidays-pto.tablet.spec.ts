import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOTablet } from './employee-ptoholidays-pto.tablet';

describe('EmployeePTOHolidaysPTOTablet', () => {
  let component: EmployeePTOHolidaysPTOTablet;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOTablet]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
