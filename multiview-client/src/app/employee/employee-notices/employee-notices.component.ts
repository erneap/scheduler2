import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { MessageService } from 'src/app/services/message.service';
import { Notification } from './employee-notices.model';
import { NotificationResponse } from 'src/app/models/web/internalWeb';

@Component({
  selector: 'app-employee-notices',
  templateUrl: './employee-notices.component.html',
  styleUrls: ['./employee-notices.component.scss']
})
export class EmployeeNoticesComponent {
  messages: Notification[] = []
  allChecked: boolean = false;
  anyChecked: boolean = false;
  gotoApprovers: boolean = false;
  gotoLeaveRequests: boolean = false;

  constructor(
    protected msgService: MessageService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    protected router: Router) { 
    this.messages = [];
    const msgs = this.msgService.getMessages();
    if (msgs && msgs.length > 0) {
      msgs.forEach(msg => {
        this.messages.push(new Notification(msg));
      });
      this.messages.sort((a,b) => a.compareTo(b));
    }
    if (this.messages.length <= 0) {
      this.router.navigateByUrl('/employee/schedule');
    } else {
      this.messages.forEach(msg => {
        if (msg.message.toLowerCase().indexOf("leave request") >= 0) {
          if (msg.message.toLowerCase().indexOf("created")>= 0 
            || msg.message.toLowerCase().indexOf("modified") >= 0) {
            this.gotoApprovers = true;
          } else {
            this.gotoLeaveRequests = true;
          }
        }
      });
    }
  }

  getStyle(index: number): string {
    return (index % 2 === 0) ? "even" : "odd";
  }

  onAllCheckedClick() {
    this.allChecked = !this.allChecked
    let tmsgs: Notification[] = [];
    this.messages.forEach(msg => {
      msg.checked = this.allChecked;
      tmsgs.push(new Notification(msg));
    });
    this.messages = tmsgs;
    this.allChecked = this.messages.every(m => m.checked);
    this.anyChecked = this.messages.filter(m => m.checked).length > 0;
  }

  onChange(chg: string) {
    const parts = chg.split("|");
    if (parts.length > 1) {
      let tmsgs: Notification[] = [];
      this.messages.forEach(msg => {
        if (msg.id === parts[0]) {
          msg.checked = (parts[1].toLowerCase() === 'true');
        }
        tmsgs.push(new Notification(msg));
      });
      this.messages = tmsgs;
    }
    this.allChecked = this.messages.every(m => m.checked);
    this.anyChecked = this.messages.filter(m => m.checked).length > 0;
  }

  onAcknowledge() {
    let msgs: string[] = [];
    this.messages.forEach(msg => {
      if (msg.checked) {
        msgs.push(msg.id);
      }
    });
    if (msgs.length > 0) {
      this.authService.statusMessage = "Acknowledging Messages";
      this.dialogService.showSpinner();
      this.msgService.acknowledgeMessages(msgs).subscribe({
        next: (data: NotificationResponse) => {
          this.dialogService.closeSpinner();
          this.messages = [];
          if (data && data.exception && data.exception === '') {
            if (data.messages) {
              data.messages.forEach(msg => {
                this.messages.push(new Notification(msg));
              });
              this.msgService.setMessages(this.messages);
            } else {
              this.msgService.clearMessages();
            }
            if (this.messages.length <= 0) {
              this.router.navigateByUrl('/employee/schedule');
            }
            this.authService.statusMessage = "Acknowledgement Complete";
          } else if (data && data.exception && data.exception !== '') {
            this.authService.statusMessage = data.exception;
          }
          this.msgService.showAlerts = (this.messages.length > 0);
        },
        error: err => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = `Error acknowledging messages: ${err.exception}`;
        }
      });
    }
  }

  onLeaveRequest() {
    let msgs: string[] = [];
    this.messages.forEach(msg => {
      if (msg.message.toLowerCase().indexOf("leave request") >= 0
        && !(msg.message.toLowerCase().indexOf("created")>= 0 
        || msg.message.toLowerCase().indexOf("modified") >= 0)) {
        msgs.push(msg.id);
      }
    });
    if (msgs.length > 0) {
      this.authService.statusMessage = "Acknowledging Messages";
      this.dialogService.showSpinner();
      this.msgService.acknowledgeMessages(msgs).subscribe({
        next: (data: NotificationResponse) => {
          this.dialogService.closeSpinner();
          this.messages = [];
          if (data && data.messages && data.exception === '') {
            data.messages.forEach(msg => {
              this.messages.push(new Notification(msg));
            });
          }
          this.msgService.setMessages(this.messages);
          this.msgService.showAlerts = (this.messages.length > 0);
          this.authService.statusMessage = "Acknowledgement Complete";
          this.router.navigateByUrl('/employee/leaverequest');
        },
        error: err => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = `Error acknowledging messages: ${err.exception}`;
        }
      });
    }
  }

  onApprovers() {
    let msgs: string[] = [];
    this.messages.forEach(msg => {
      if (msg.message.toLowerCase().indexOf("leave request") >= 0
        && (msg.message.toLowerCase().indexOf("created")>= 0 
        || msg.message.toLowerCase().indexOf("modified") >= 0)) {
        msgs.push(msg.id);
      }
    });
    if (msgs.length > 0) {
      this.authService.statusMessage = "Acknowledging Messages";
      this.dialogService.showSpinner();
      this.msgService.acknowledgeMessages(msgs).subscribe({
        next: (data: NotificationResponse) => {
          this.dialogService.closeSpinner();
          this.messages = [];
          if (data && data.messages && data.exception === '') {
            data.messages.forEach(msg => {
              this.messages.push(new Notification(msg));
            });
          }
          this.msgService.setMessages(this.messages);
          this.msgService.showAlerts = (this.messages.length > 0);
          this.authService.statusMessage = "Acknowledgement Complete";
          this.router.navigateByUrl('/siteleaveapprover');
        },
        error: (err: NotificationResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = `Error acknowledging messages: ${err.exception}`;
        }
      });
    }
  }

  getWidthStyle(part: string): string {
    let width = window.innerWidth;
    if (width > 800) {
      width = 800;
    }
    switch (part.toLowerCase()) {
      case "checkbox":
        width = 35;
        break;
      case "date":
        width = Math.floor(width / 4);
        break;
      case "message":
        width = Math.floor(width * (565/800));
        break;
    }
    return `width: ${width}px;`;
  }
}
