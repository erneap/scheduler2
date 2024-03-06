import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProfileMobile } from './employee-profile.mobile';

describe('EmployeeProfileMobile', () => {
  let component: EmployeeProfileMobile;
  let fixture: ComponentFixture<EmployeeProfileMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeProfileMobile]
    });
    fixture = TestBed.createComponent(EmployeeProfileMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
