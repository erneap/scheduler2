import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltMobile } from './employee-ptoholidays-alt.mobile';

describe('EmployeePtoholidaysAltMobile', () => {
  let component: EmployeePtoholidaysAltMobile;
  let fixture: ComponentFixture<EmployeePtoholidaysAltMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltMobile]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
