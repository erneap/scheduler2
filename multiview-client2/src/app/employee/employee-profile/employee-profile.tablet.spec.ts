import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProfileTablet } from './employee-profile.tablet';

describe('EmployeeProfileTablet', () => {
  let component: EmployeeProfileTablet;
  let fixture: ComponentFixture<EmployeeProfileTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeProfileTablet]
    });
    fixture = TestBed.createComponent(EmployeeProfileTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
