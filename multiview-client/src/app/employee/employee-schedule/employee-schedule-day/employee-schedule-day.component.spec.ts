import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleDayComponent } from './employee-schedule-day.component';

describe('EmployeeScheduleDayComponent', () => {
  let component: EmployeeScheduleDayComponent;
  let fixture: ComponentFixture<EmployeeScheduleDayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleDayComponent]
    });
    fixture = TestBed.createComponent(EmployeeScheduleDayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
