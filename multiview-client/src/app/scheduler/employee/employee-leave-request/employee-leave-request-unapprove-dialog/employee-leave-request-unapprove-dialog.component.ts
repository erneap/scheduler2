import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-leave-request-unapprove-dialog',
  templateUrl: './employee-leave-request-unapprove-dialog.component.html',
  styleUrls: ['./employee-leave-request-unapprove-dialog.component.scss']
})
export class EmployeeLeaveRequestUnapproveDialogComponent {
  commentForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EmployeeLeaveRequestUnapproveDialogComponent>,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: '',
    });
  }
}
