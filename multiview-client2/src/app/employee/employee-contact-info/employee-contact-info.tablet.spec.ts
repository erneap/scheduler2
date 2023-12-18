import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactInfoTablet } from './employee-contact-info.tablet';

describe('EmployeeContactInfoTablet', () => {
  let component: EmployeeContactInfoTablet;
  let fixture: ComponentFixture<EmployeeContactInfoTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContactInfoTablet]
    });
    fixture = TestBed.createComponent(EmployeeContactInfoTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
