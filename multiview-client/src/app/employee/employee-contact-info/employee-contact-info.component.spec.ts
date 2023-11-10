import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactInfoComponent } from './employee-contact-info.component';

describe('EmployeeContactInfoComponent', () => {
  let component: EmployeeContactInfoComponent;
  let fixture: ComponentFixture<EmployeeContactInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContactInfoComponent]
    });
    fixture = TestBed.createComponent(EmployeeContactInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
