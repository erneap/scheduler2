import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-password-expire-dialog',
  templateUrl: './password-expire-dialog.component.html',
  styleUrls: ['./password-expire-dialog.component.scss']
})
export class PasswordExpireDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PasswordExpireDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  days: number;
}