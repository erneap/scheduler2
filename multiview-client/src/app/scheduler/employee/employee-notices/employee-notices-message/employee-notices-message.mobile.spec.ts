import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesMessageMobile } from './employee-notices-message.mobile';

describe('EmployeeNoticesMessageMobile', () => {
  let component: EmployeeNoticesMessageMobile;
  let fixture: ComponentFixture<EmployeeNoticesMessageMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesMessageMobile]
    });
    fixture = TestBed.createComponent(EmployeeNoticesMessageMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
