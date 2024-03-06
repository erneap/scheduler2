import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltPtoCellDisplayComponent } from './employee-ptoholidays-alt-pto-cell-display.component';

describe('EmployeePtoholidaysAltPtoCellDisplayComponent', () => {
  let component: EmployeePtoholidaysAltPtoCellDisplayComponent;
  let fixture: ComponentFixture<EmployeePtoholidaysAltPtoCellDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltPtoCellDisplayComponent]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltPtoCellDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
