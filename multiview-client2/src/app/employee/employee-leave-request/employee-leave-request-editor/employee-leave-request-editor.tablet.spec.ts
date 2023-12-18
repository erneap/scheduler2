import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestEditorTablet } from './employee-leave-request-editor.tablet';

describe('EmployeeLeaveRequestEditorTablet', () => {
  let component: EmployeeLeaveRequestEditorTablet;
  let fixture: ComponentFixture<EmployeeLeaveRequestEditorTablet>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestEditorTablet]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestEditorTablet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
