import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeContactInfoItemComponent } from './employee-contact-info-item.component';

describe('EmployeeContactInfoItemComponent', () => {
  let component: EmployeeContactInfoItemComponent;
  let fixture: ComponentFixture<EmployeeContactInfoItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeContactInfoItemComponent]
    });
    fixture = TestBed.createComponent(EmployeeContactInfoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
