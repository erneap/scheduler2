import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestEditorComponent } from './employee-leave-request-editor.component';

describe('EmployeeLeaveRequestEditorComponent', () => {
  let component: EmployeeLeaveRequestEditorComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestEditorComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
