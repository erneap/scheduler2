import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltHolidaysCellComponent } from './employee-ptoholidays-alt-holidays-cell.component';

describe('EmployeePtoholidaysAltHolidaysCellComponent', () => {
  let component: EmployeePtoholidaysAltHolidaysCellComponent;
  let fixture: ComponentFixture<EmployeePtoholidaysAltHolidaysCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltHolidaysCellComponent]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltHolidaysCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
