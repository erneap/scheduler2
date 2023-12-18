import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTODesktop } from './employee-ptoholidays-pto.desktop';

describe('EmployeePTOHolidaysPTODesktop', () => {
  let component: EmployeePTOHolidaysPTODesktop;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTODesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTODesktop]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTODesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
