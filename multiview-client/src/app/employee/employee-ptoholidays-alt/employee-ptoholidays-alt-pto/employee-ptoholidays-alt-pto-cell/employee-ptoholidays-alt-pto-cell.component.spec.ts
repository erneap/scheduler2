import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePtoholidaysAltPtoCellComponent } from './employee-ptoholidays-alt-pto-cell.component';

describe('EmployeePtoholidaysAltPtoCellComponent', () => {
  let component: EmployeePtoholidaysAltPtoCellComponent;
  let fixture: ComponentFixture<EmployeePtoholidaysAltPtoCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePtoholidaysAltPtoCellComponent]
    });
    fixture = TestBed.createComponent(EmployeePtoholidaysAltPtoCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
