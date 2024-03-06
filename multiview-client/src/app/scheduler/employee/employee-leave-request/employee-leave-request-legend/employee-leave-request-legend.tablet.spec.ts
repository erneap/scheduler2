import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestLegendTablet } from './employee-leave-request-legend.tablet';

describe('EmployeeLeaveRequestLegendTablet', () => {
  let component: EmployeeLeaveRequestLegendTablet;
  let fixture: ComponentFixture<EmployeeLeaveRequestLegendTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestLegendTablet]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestLegendTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
