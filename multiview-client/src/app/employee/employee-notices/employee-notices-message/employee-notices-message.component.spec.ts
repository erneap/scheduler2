import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeNoticesMessageComponent } from './employee-notices-message.component';

describe('EmployeeNoticesMessageComponent', () => {
  let component: EmployeeNoticesMessageComponent;
  let fixture: ComponentFixture<EmployeeNoticesMessageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeNoticesMessageComponent]
    });
    fixture = TestBed.createComponent(EmployeeNoticesMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
