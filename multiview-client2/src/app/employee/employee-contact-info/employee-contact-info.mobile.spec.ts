import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactInfoMobile } from './employee-contact-info.mobile';

describe('EmployeeContactInfoMobile', () => {
  let component: EmployeeContactInfoMobile;
  let fixture: ComponentFixture<EmployeeContactInfoMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContactInfoMobile]
    });
    fixture = TestBed.createComponent(EmployeeContactInfoMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
