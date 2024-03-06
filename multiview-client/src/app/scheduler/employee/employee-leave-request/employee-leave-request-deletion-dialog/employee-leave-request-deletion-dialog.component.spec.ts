import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeLeaveRequestDeletionDialogComponent } from './employee-leave-request-deletion-dialog.component';

describe('EmployeeLeaveRequestDeletionDialogComponent', () => {
  let component: EmployeeLeaveRequestDeletionDialogComponent;
  let fixture: ComponentFixture<EmployeeLeaveRequestDeletionDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeLeaveRequestDeletionDialogComponent]
    });
    fixture = TestBed.createComponent(EmployeeLeaveRequestDeletionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
