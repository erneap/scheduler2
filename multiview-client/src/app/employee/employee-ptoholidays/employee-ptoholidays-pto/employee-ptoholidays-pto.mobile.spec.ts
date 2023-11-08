import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOMobile } from './employee-ptoholidays-pto.mobile';

describe('EmployeePTOHolidaysPTOMobile', () => {
  let component: EmployeePTOHolidaysPTOMobile;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOMobile]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
