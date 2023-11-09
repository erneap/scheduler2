import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestEditorDesktop } from './employee-leave-request-editor.desktop';

describe('EmployeeLeaveRequestEditorDesktop', () => {
  let component: EmployeeLeaveRequestEditorDesktop;
  let fixture: ComponentFixture<EmployeeLeaveRequestEditorDesktop>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestEditorDesktop]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestEditorDesktop);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
