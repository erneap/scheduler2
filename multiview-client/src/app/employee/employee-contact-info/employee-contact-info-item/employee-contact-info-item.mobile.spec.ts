import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactInfoItemMobile } from './employee-contact-info-item.mobile';

describe('EmployeeContactInfoItemMobile', () => {
  let component: EmployeeContactInfoItemMobile;
  let fixture: ComponentFixture<EmployeeContactInfoItemMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContactInfoItemMobile]
    });
    fixture = TestBed.createComponent(EmployeeContactInfoItemMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
