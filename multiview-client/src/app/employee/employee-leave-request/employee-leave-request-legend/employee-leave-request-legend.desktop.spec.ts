import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestLegendDesktop } from './employee-leave-request-legend.desktop';

describe('EmployeeLeaveRequestLegendDesktop', () => {
  let component: EmployeeLeaveRequestLegendDesktop;
  let fixture: ComponentFixture<EmployeeLeaveRequestLegendDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestLegendDesktop]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestLegendDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
