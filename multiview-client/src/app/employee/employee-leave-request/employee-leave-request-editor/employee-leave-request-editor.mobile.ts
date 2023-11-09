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

@Component({
  selector: 'app-employee-leave-request-editor',
  templateUrl: './employee-leave-request-editor.mobile.html',
  styleUrls: ['./employee-leave-request-editor.mobile.scss']
})
export class EmployeeLeaveRequestEditorMobile extends EmployeeLeaveRequestEditorComponent {
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
