import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidayChartComponent } from './employee-ptoholiday-chart.component';

describe('EmployeePTOHolidayChartComponent', () => {
  let component: EmployeePTOHolidayChartComponent;
  let fixture: ComponentFixture<EmployeePTOHolidayChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidayChartComponent]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidayChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
