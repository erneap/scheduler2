import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestUnapproveDialogComponent } from './employee-leave-request-unapprove-dialog.component';

describe('EmployeeLeaveRequestUnapproveDialogComponent', () => {
  let component: EmployeeLeaveRequestUnapproveDialogComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestUnapproveDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestUnapproveDialogComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestUnapproveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
