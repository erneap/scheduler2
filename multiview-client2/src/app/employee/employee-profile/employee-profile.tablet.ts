import { Component } from '@angular/core';
import { EmployeeProfileComponent } from './employee-profile.component';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employee-profile-tablet',
  templateUrl: './employee-profile.tablet.html',
  styleUrls: ['./employee-profile.tablet.scss']
})
export class EmployeeProfileTablet extends EmployeeProfileComponent {
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
