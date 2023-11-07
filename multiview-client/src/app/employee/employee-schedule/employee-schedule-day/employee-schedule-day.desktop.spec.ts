import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleDayDesktop } from './employee-schedule-day.desktop';

describe('EmployeeScheduleDayDesktop', () => {
  let component: EmployeeScheduleDayDesktop;
  let fixture: ComponentFixture<EmployeeScheduleDayDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleDayDesktop]
    });
    fixture = TestBed.createComponent(EmployeeScheduleDayDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
