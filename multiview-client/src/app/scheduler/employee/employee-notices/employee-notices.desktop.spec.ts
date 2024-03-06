import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesDesktop } from './employee-notices.desktop';

describe('EmployeeNoticesDesktop', () => {
  let component: EmployeeNoticesDesktop;
  let fixture: ComponentFixture<EmployeeNoticesDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesDesktop]
    });
    fixture = TestBed.createComponent(EmployeeNoticesDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
