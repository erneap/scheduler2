import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOMonthComponent } from './employee-ptoholidays-ptomonth.component';

describe('EmployeePTOHolidaysPTOMonthComponent', () => {
  let component: EmployeePTOHolidaysPTOMonthComponent;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOMonthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOMonthComponent]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
