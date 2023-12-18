import { Component } from '@angular/core';
import { EmployeeProfileComponent } from './employee-profile.component';
import { AuthService } from 'src/app/services/auth.service';
import { SiteService } from 'src/app/services/site.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employee-profile-desktop',
  templateUrl: './employee-profile.desktop.html',
  styleUrls: ['./employee-profile.desktop.scss']
})
export class EmployeeProfileDesktop extends EmployeeProfileComponent {
  constructor(
    protected as: AuthService,
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ds: DialogService,
    private hc: HttpClient,
    private f: FormBuilder
  ) {
    super(as, es, ss, ds, hc, f);
  }
}
