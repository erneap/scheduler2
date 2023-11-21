import { Component } from '@angular/core';
import { EmployeeLeaveRequestEditorComponent } from './employee-leave-request-editor.component';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { MessageService } from 'src/app/services/message.service';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

@Component({
  selector: 'app-employee-leave-request-editor-desktop',
  templateUrl: './employee-leave-request-editor.desktop.html',
  styleUrls: ['./employee-leave-request-editor.desktop.scss'],
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
export class EmployeeLeaveRequestEditorDesktop extends EmployeeLeaveRequestEditorComponent {
  constructor(
    protected as: AuthService,
    protected es: EmployeeService,
    protected ss: SiteService,
    protected ts: TeamService,
    protected ds: DialogService,
    protected ms: MessageService,
    private f: FormBuilder,
    protected d: MatDialog
  ) {
    super(as, es, ss, ts, ds, ms, f, d);
  }
}
