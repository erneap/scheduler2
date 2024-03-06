import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltPtoComponent } from './employee-ptoholidays-alt-pto.component';

describe('EmployeePtoholidaysAltPtoComponent', () => {
  let component: EmployeePtoholidaysAltPtoComponent;
  let fixture: ComponentFixture<EmployeePtoholidaysAltPtoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltPtoComponent]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltPtoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
