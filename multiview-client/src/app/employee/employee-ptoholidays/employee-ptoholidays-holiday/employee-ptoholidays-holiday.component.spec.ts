import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayComponent } from './employee-ptoholidays-holiday.component';

describe('EmployeePTOHolidaysHolidayComponent', () => {
  let component: EmployeePTOHolidaysHolidayComponent;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayComponent]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
