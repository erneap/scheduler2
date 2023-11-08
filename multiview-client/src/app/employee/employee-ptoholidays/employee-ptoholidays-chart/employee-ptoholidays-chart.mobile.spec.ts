import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysChartMobile } from './employee-ptoholidays-chart.mobile';

describe('EmployeePTOHolidaysChartMobile', () => {
  let component: EmployeePTOHolidaysChartMobile;
  let fixture: ComponentFixture<EmployeePTOHolidaysChartMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysChartMobile]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysChartMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
