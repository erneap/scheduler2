import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleDayTablet } from './employee-schedule-day.tablet';

describe('EmployeeScheduleDayTablet', () => {
  let component: EmployeeScheduleDayTablet;
  let fixture: ComponentFixture<EmployeeScheduleDayTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleDayTablet]
    });
    fixture = TestBed.createComponent(EmployeeScheduleDayTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
