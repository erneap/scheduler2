import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestDayTablet } from './employee-leave-request-day.tablet';

describe('EmployeeLeaveRequestDayTablet', () => {
  let component: EmployeeLeaveRequestDayTablet;
  let fixture: ComponentFixture<EmployeeLeaveRequestDayTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestDayTablet]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestDayTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
