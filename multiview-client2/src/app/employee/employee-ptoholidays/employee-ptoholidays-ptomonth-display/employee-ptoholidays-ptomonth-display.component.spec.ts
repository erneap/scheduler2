import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOMonthDisplayComponent } from './employee-ptoholidays-ptomonth-display.component';

describe('EmployeePTOHolidaysPTOMonthDisplayComponent', () => {
  let component: EmployeePTOHolidaysPTOMonthDisplayComponent;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOMonthDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOMonthDisplayComponent]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOMonthDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
