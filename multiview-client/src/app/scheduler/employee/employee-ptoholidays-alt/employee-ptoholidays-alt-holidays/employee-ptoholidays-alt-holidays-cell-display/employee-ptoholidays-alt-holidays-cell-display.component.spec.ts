import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltHolidaysCellDisplayComponent } from './employee-ptoholidays-alt-holidays-cell-display.component';

describe('EmployeePtoholidaysAltHolidaysCellDisplayComponent', () => {
  let component: EmployeePtoholidaysAltHolidaysCellDisplayComponent;
  let fixture: ComponentFixture<EmployeePtoholidaysAltHolidaysCellDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltHolidaysCellDisplayComponent]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltHolidaysCellDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
