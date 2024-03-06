import { Component } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SiteLeaveApprovalComponent } from './site-leave-approval.component';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-site-leave-approval-mobile',
  templateUrl: './site-leave-approval.mobile.html',
  styleUrls: ['./site-leave-approval.mobile.scss'],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true}},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class SiteLeaveApprovalMobile extends SiteLeaveApprovalComponent {
  constructor(
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ts: TeamService,
    protected as: AuthService,
    protected ds: DialogService,
    private d: MatDialog,
    private f: FormBuilder
  ) { super(es, ss, ts, as, ds, d, f); }
}
