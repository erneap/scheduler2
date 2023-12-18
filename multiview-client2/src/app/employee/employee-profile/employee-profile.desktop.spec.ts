import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProfileDesktop } from './employee-profile.desktop';

describe('EmployeeProfileDesktop', () => {
  let component: EmployeeProfileDesktop;
  let fixture: ComponentFixture<EmployeeProfileDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeProfileDesktop]
    });
    fixture = TestBed.createComponent(EmployeeProfileDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
