import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleMonthComponent } from './employee-schedule-month.component';

describe('EmployeeScheduleMonthComponent', () => {
  let component: EmployeeScheduleMonthComponent;
  let fixture: ComponentFixture<EmployeeScheduleMonthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleMonthComponent]
    });
    fixture = TestBed.createComponent(EmployeeScheduleMonthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
