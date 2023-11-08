import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysHolidayCellDisplayComponent } from './employee-ptoholidays-holiday-cell-display.component';

describe('EmployeePTOHolidaysHolidayCellDisplayComponent', () => {
  let component: EmployeePTOHolidaysHolidayCellDisplayComponent;
  let fixture: ComponentFixture<EmployeePTOHolidaysHolidayCellDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysHolidayCellDisplayComponent]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysHolidayCellDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
