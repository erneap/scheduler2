import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysChartTablet } from './employee-ptoholidays-chart.tablet';

describe('EmployeePTOHolidaysChartTablet', () => {
  let component: EmployeePTOHolidaysChartTablet;
  let fixture: ComponentFixture<EmployeePTOHolidaysChartTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysChartTablet]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysChartTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
