import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSpecialtiesMobile } from './employee-specialties.mobile';

describe('EmployeeSpecialtiesMobile', () => {
  let component: EmployeeSpecialtiesMobile;
  let fixture: ComponentFixture<EmployeeSpecialtiesMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSpecialtiesMobile]
    });
    fixture = TestBed.createComponent(EmployeeSpecialtiesMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
