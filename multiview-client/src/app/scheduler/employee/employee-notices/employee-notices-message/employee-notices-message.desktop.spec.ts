import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesMessageDesktop } from './employee-notices-message.desktop';

describe('EmployeeNoticesMessageDesktop', () => {
  let component: EmployeeNoticesMessageDesktop;
  let fixture: ComponentFixture<EmployeeNoticesMessageDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesMessageDesktop]
    });
    fixture = TestBed.createComponent(EmployeeNoticesMessageDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
