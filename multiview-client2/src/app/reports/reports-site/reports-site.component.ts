import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reports-site',
  templateUrl: './reports-site.component.html',
  styleUrls: ['./reports-site.component.scss']
})
export class ReportsSiteComponent {
  reportForm: FormGroup;
  reportType: string = '';

  constructor(
    private fb: FormBuilder
  ) {
    this.reportForm = this.fb.group({
      reportType: '',
    });
  }

  onSelect() {
    this.reportType = this.reportForm.value.reportType;
  }
}
