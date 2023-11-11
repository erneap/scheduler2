import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeSpecialtiesComponent } from './employee-specialties.component';

describe('EmployeeSpecialtiesComponent', () => {
  let component: EmployeeSpecialtiesComponent;
  let fixture: ComponentFixture<EmployeeSpecialtiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeSpecialtiesComponent]
    });
    fixture = TestBed.createComponent(EmployeeSpecialtiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
