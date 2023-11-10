import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactInfoDesktop } from './employee-contact-info.desktop';

describe('EmployeeContactInfoDesktop', () => {
  let component: EmployeeContactInfoDesktop;
  let fixture: ComponentFixture<EmployeeContactInfoDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContactInfoDesktop]
    });
    fixture = TestBed.createComponent(EmployeeContactInfoDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
