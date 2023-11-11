import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSpecialtiesDesktop } from './employee-specialties.desktop';

describe('EmployeeSpecialtiesDesktop', () => {
  let component: EmployeeSpecialtiesDesktop;
  let fixture: ComponentFixture<EmployeeSpecialtiesDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSpecialtiesDesktop]
    });
    fixture = TestBed.createComponent(EmployeeSpecialtiesDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
