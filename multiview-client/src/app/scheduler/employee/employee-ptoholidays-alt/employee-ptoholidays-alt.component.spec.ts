import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltComponent } from './employee-ptoholidays-alt.component';

describe('EmployeePtoholidaysAltComponent', () => {
  let component: EmployeePtoholidaysAltComponent;
  let fixture: ComponentFixture<EmployeePtoholidaysAltComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltComponent]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
