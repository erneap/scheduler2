import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestEditorMobile } from './employee-leave-request-editor.mobile';

describe('EmployeeLeaveRequestEditorMobile', () => {
  let component: EmployeeLeaveRequestEditorMobile;
  let fixture: ComponentFixture<EmployeeLeaveRequestEditorMobile>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestEditorMobile]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestEditorMobile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
