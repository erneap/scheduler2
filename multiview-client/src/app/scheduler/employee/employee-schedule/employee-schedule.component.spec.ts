import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeScheduleComponent } from './employee-schedule.component';

describe('EmployeeScheduleComponent', () => {
  let component: EmployeeScheduleComponent;
  let fixture: ComponentFixture<EmployeeScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeScheduleComponent]
    });
    fixture = TestBed.createComponent(EmployeeScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
