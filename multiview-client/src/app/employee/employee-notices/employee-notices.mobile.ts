import { Component } from '@angular/core';
import { EmployeeNoticesComponent } from './employee-notices.component';
import { MessageService } from 'src/app/services/message.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employee-notices-mobile',
  templateUrl: './employee-notices.mobile.html',
  styleUrls: ['./employee-notices.mobile.scss']
})
export class EmployeeNoticesMobile extends EmployeeNoticesComponent {
  constructor(
    protected ms: MessageService,
    protected ds: DialogService,
    protected as: AuthService,
    protected r: Router) { 
    super(ms, ds, as, r);
  }
}
