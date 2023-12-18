import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesMessageTablet } from './employee-notices-message.tablet';

describe('EmployeeNoticesMessageTablet', () => {
  let component: EmployeeNoticesMessageTablet;
  let fixture: ComponentFixture<EmployeeNoticesMessageTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesMessageTablet]
    });
    fixture = TestBed.createComponent(EmployeeNoticesMessageTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
