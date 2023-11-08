import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysChartDesktop } from './employee-ptoholidays-chart.desktop';

describe('EmployeePTOHolidaysChartDesktop', () => {
  let component: EmployeePTOHolidaysChartDesktop;
  let fixture: ComponentFixture<EmployeePTOHolidaysChartDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysChartDesktop]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysChartDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
