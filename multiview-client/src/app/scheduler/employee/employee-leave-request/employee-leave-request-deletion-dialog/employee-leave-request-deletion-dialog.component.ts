import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-leave-request-deletion-dialog',
  templateUrl: './employee-leave-request-deletion-dialog.component.html',
  styleUrls: ['./employee-leave-request-deletion-dialog.component.scss']
})
export class EmployeeLeaveRequestDeletionDialogComponent {
  yes: string = 'yes';
  no: string = 'no';

  constructor(
    public dialogRef: MatDialogRef<EmployeeLeaveRequestDeletionDialogComponent>,
  ) {}
}
