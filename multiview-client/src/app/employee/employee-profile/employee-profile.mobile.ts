import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { EmployeeProfileComponent } from './employee-profile.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-profile-mobile',
  templateUrl: './employee-profile.mobile.html',
  styleUrls: ['./employee-profile.mobile.scss']
})
export class EmployeeProfileMobile extends EmployeeProfileComponent {
  constructor(
    protected as: AuthService,
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ds: DialogService,
    private hc: HttpClient,
    private f: FormBuilder,
    private d: MatDialog
  ) {
    super(as, es, ss, ds, hc, f, d);
  }

  getDisplayClass(): string {
    if (window.innerHeight > window.innerWidth) {
      return 'flexlayout column center';
    }
    return 'flexlayout row center';
  }
}
