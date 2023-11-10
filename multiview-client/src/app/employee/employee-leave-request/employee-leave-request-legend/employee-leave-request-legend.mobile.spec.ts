import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestLegendMobile } from './employee-leave-request-legend.mobile';

describe('EmployeeLeaveRequestLegendMobile', () => {
  let component: EmployeeLeaveRequestLegendMobile;
  let fixture: ComponentFixture<EmployeeLeaveRequestLegendMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestLegendMobile]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestLegendMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
