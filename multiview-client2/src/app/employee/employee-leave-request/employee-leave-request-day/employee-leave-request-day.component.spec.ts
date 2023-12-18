import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestDayComponent } from './employee-leave-request-day.component';

describe('EmployeeLeaveRequestDayComponent', () => {
  let component: EmployeeLeaveRequestDayComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestDayComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
