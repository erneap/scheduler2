import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactInfoItemDesktop } from './employee-contact-info-item.desktop';

describe('EmployeeContactInfoItemDesktop', () => {
  let component: EmployeeContactInfoItemDesktop;
  let fixture: ComponentFixture<EmployeeContactInfoItemDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContactInfoItemDesktop]
    });
    fixture = TestBed.createComponent(EmployeeContactInfoItemDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
