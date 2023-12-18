import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesComponent } from './employee-notices.component';

describe('EmployeeNoticesComponent', () => {
  let component: EmployeeNoticesComponent;
  let fixture: ComponentFixture<EmployeeNoticesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesComponent]
    });
    fixture = TestBed.createComponent(EmployeeNoticesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
