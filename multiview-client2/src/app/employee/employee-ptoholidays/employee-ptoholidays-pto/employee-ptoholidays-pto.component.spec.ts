import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePTOHolidaysPTOComponent } from './employee-ptoholidays-pto.component';

describe('EmployeePTOHolidaysPTOComponent', () => {
  let component: EmployeePTOHolidaysPTOComponent;
  let fixture: ComponentFixture<EmployeePTOHolidaysPTOComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeePTOHolidaysPTOComponent]
    });
    fixture = TestBed.createComponent(EmployeePTOHolidaysPTOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
