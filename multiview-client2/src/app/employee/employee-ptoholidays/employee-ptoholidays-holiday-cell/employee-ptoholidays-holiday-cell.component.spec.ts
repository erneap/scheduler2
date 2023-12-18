import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayCellComponent } from './employee-ptoholidays-holiday-cell.component';

describe('EmployeePTOHolidaysHolidayCellComponent', () => {
  let component: EmployeePTOHolidaysHolidayCellComponent;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayCellComponent]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
