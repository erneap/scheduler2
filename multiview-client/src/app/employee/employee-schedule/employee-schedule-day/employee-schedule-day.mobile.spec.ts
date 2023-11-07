import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleDayMobile } from './employee-schedule-day.mobile';

describe('EmployeeScheduleDayMobile', () => {
  let component: EmployeeScheduleDayMobile;
  let fixture: ComponentFixture<EmployeeScheduleDayMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleDayMobile]
    });
    fixture = TestBed.createComponent(EmployeeScheduleDayMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
