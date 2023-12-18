import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltHolidaysComponent } from './employee-ptoholidays-alt-holidays.component';

describe('EmployeePtoholidaysAltHolidaysComponent', () => {
  let component: EmployeePtoholidaysAltHolidaysComponent;
  let fixture: ComponentFixture<EmployeePtoholidaysAltHolidaysComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltHolidaysComponent]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltHolidaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
