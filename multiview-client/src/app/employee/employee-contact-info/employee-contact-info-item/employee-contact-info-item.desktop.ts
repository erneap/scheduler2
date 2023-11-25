import { Component } from '@angular/core';
import { EmployeeContactInfoItemComponent } from './employee-contact-info-item.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employee-contact-info-item-desktop',
  templateUrl: './employee-contact-info-item.desktop.html',
  styleUrls: ['./employee-contact-info-item.desktop.scss']
})
export class EmployeeContactInfoItemDesktop 
  extends EmployeeContactInfoItemComponent {
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ds: DialogService,
    protected as: AuthService,
    private f: FormBuilder
  ) {
    super(es, ss, ds, as, f);
  }
}