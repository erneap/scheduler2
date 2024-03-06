import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesTablet } from './employee-notices.tablet';

describe('EmployeeNoticesTablet', () => {
  let component: EmployeeNoticesTablet;
  let fixture: ComponentFixture<EmployeeNoticesTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesTablet]
    });
    fixture = TestBed.createComponent(EmployeeNoticesTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
