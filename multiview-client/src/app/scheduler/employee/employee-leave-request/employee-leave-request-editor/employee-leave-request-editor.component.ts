import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { LeaveRequest } from 'src/app/models/employees/leave';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Workcode } from 'src/app/models/teams/workcode';
import { AuthService } from 'src/app/services/auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { MessageService } from 'src/app/services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { EmployeeLeaveRequestDeletionDialogComponent } from '../employee-leave-request-deletion-dialog/employee-leave-request-deletion-dialog.component';
import { EmployeeLeaveRequestUnapproveDialogComponent } from '../employee-leave-request-unapprove-dialog/employee-leave-request-unapprove-dialog.component';
import { ISite, Site } from 'src/app/models/sites/site';

@Component({
  selector: 'app-employee-leave-request-editor',
  templateUrl: './employee-leave-request-editor.component.html',
  styleUrls: ['./employee-leave-request-editor.component.scss'],
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
export class EmployeeLeaveRequestEditorComponent {
  private _employee: Employee = new Employee();
  private _site: Site = new Site();
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
    this.setRequests();
    this.editorForm.controls['leaverequest'].setValue('');
  }
  get employee(): Employee {
    return this._employee;
  }
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  @Input() maxWidth: number = 1200;
  @Output() changed = new EventEmitter<Employee>();

  requests: LeaveRequest[] = [];
  selected?: LeaveRequest;
  editorForm: FormGroup;
  commentForm: FormGroup;
  draft: boolean = false;
  ptohours: number = 0;
  holidayhours: number = 0;
  workcodes: Workcode[] = [];
  approver: boolean = false;
  stdHours: number = 10.0;

  constructor(
    protected authService: AuthService,
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected msgService: MessageService,
    private fb: FormBuilder,
    protected dialog: MatDialog
  ) { 
    this.editorForm = this.fb.group({
      leaverequest: '',
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      primarycode: ['', [Validators.required]],
      comment: '',
    });
    this.commentForm = this.fb.group({
      comment: '',
    });
    this.workcodes = [];
    const team = this.teamService.getTeam();
    if (team) {
      team.workcodes.forEach(wc => {
        if (wc.isLeave) {
          this.workcodes.push(new Workcode(wc));
        }
      });
      this.workcodes.sort((a,b) => a.compareTo(b));
    }
    const site = this.siteService.getSite();
    if (site) {
      this.site = site;
    }
    const iEmp = this.empService.getEmployee();
    if (iEmp) {
      this.employee = iEmp;
    }
    this.setCurrent();
    const tEmp = this.authService.getUser();
    if (tEmp) {
      if (this.employee.id !== tEmp.id 
        && (this.authService.hasRole('scheduler')
        || this.authService.hasRole('siteleader'))) {
        this.approver = true;
      }
    }
  }

  setMaxWidth(): string {
    if (this.maxWidth > window.innerWidth- 250) {
      this.maxWidth = window.innerWidth - 250;
    }
    return `width: ${this.maxWidth}px;`;
  }

  setRequests() {
    this.requests = [];
    let now = new Date();
    now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
    this.employee.requests.forEach(req => {
      if (req.enddate.getTime() >= now.getTime()) {
        this.requests.push(new LeaveRequest(req));
      }
    });
    this.requests.sort((a,b) => a.compareTo(b));

    this.stdHours = this.employee.getStandardWorkday(this.site.id, now);
  }

  setCurrent() {
    if (this.selected) {
      this.editorForm.controls['start'].setValue(this.selected.startdate);
      this.editorForm.controls['end'].setValue(this.selected.enddate);
      this.editorForm.controls['primarycode'].setValue(this.selected.primarycode);
      this.editorForm.controls['comment'].setValue('');
      this.editorForm.controls['start'].enable();
      this.editorForm.controls['end'].enable();
      this.editorForm.controls['primarycode'].enable();
      this.editorForm.controls['comment'].enable();
      this.draft = (this.selected.status.toLowerCase() === 'draft')
      const tEmp = this.authService.getUser();
      if (tEmp) {
        if (this.selected.id !== '' && this.employee.id !== tEmp.id 
          && this.selected.status.toLowerCase() === "requested"
          && this.selected.approvedby === ''
          && (this.authService.hasRole('scheduler')
          || this.authService.hasRole('siteleader'))) {
          this.approver = true;
        }
      }
      this.ptohours = 0.0;
      this.holidayhours = 0.0;
      this.selected.requesteddays.forEach(day => {
        if (day.code.toLowerCase() === 'v') {
          this.ptohours += day.hours;
        } else if (day.code.toLowerCase() === 'h') {
          this.holidayhours += day.hours;
        }
      });
    } else {
      this.editorForm.controls['start'].setValue('');
      this.editorForm.controls['end'].setValue('');
      this.editorForm.controls['primarycode'].setValue('');
      this.editorForm.controls['comment'].setValue('');
      this.editorForm.controls['start'].disable();
      this.editorForm.controls['end'].disable();
      this.editorForm.controls['primarycode'].disable();
      this.editorForm.controls['comment'].disable();
      this.draft = true
      this.approver = false;
      this.ptohours = 0.0;
      this.holidayhours = 0.0;
    }
  }

  setRequest() {
    const reqID = this.editorForm.value.leaverequest;
    this.ptohours = 0.0;
    this.holidayhours = 0.0;
    this.approver = false;
    this.selected = undefined;
    if (reqID === '0' || reqID === 'new') {
      let now = new Date();
      now = new Date(Date.UTC(now.getUTCFullYear(), now.getMonth(), 
        now.getDate(), 0, 0, 0, 0));
      this.dialogService.showSpinner();
      this.empService.addNewLeaveRequest(this.employee.id, now, now, 'V')
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              const emp = new Employee(data.employee);
              emp.requests.forEach(eReq => {
                let found = false;
                this.employee.requests.forEach(oReq => {
                  if (oReq.id === eReq.id) {
                    found = true;
                  }
                });
                if (!found) {
                  this.selected = new LeaveRequest(eReq);
                }
              });
              this.employee = data.employee;
              this.empService.replaceEmployee(emp);
            }
            if (this.selected) {
              this.editorForm.controls['leaverequest'].setValue(this.selected.id);
            }
            this.setCurrent();
          }
          this.authService.statusMessage = "Leave Request processing complete";
          this.changed.emit(new Employee(this.employee));
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    } else {
      this.requests.forEach(req => {
        if (req.id === reqID) {
          this.selected = new LeaveRequest(req);
        }
      });
      this.setCurrent();
    }
  }

  getDateString(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  getRequestLabel(req: LeaveRequest): string {
    const start = this.getDateString(req.startdate);
    const end = this.getDateString(req.enddate);
    if (start === end) {
      return start;
    }
    return `${start} - ${end}`;
  }

  processChange(field: string) {
    if (this.employee && this.selected && this.selected.id !== ''
      && this.selected.id !== 'new') {
      let value = '';
      switch (field.toLowerCase()) {
        case "start":
          const start = this.editorForm.value.start;
          if (start) {
            const dStart = new Date(start);
            value = `${dStart.getUTCFullYear()}-`
              + `${(dStart.getUTCMonth() < 9) ? '0' : ''}${dStart.getUTCMonth() + 1}-`
              + `${(dStart.getUTCDate() < 10) ? '0' : ''}${dStart.getUTCDate()}`;
          }
          break;
        case "end":
          const end = this.editorForm.value.end;
          if (end) {
            const dEnd = new Date(end);
            value = `${dEnd.getUTCFullYear()}-`
              + `${(dEnd.getUTCMonth() < 9)? '0' : ''}${dEnd.getUTCMonth() + 1}-`
              + `${(dEnd.getUTCDate() < 10) ? '0' : ''}${dEnd.getUTCDate()}`;
          }
          break;
        case "code":
          value = this.editorForm.value.primarycode;
          break;
        case "comment":
          value = this.editorForm.value.comment;
          break;
      }
      this.dialogService.showSpinner();
      if (value !== '' && this.selected) {
        this.empService.updateLeaveRequest(this.employee.id, 
          this.selected.id, field, value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.authService.statusMessage = "Updating Leave Request "
              + "Primary Code change";
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee) {
                this.employee = data.employee;
                this.employee.requests.forEach(req => {
                  if (this.selected && this.selected.id === req.id) {
                    this.selected = new LeaveRequest(req)
                  }
                });
                this.empService.replaceEmployee(this.employee);
              }
              this.setCurrent();
            }
            this.authService.statusMessage = "Update complete";
            this.changed.emit(new Employee(this.employee));
          },
          error: (err: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    } else if (field.toLowerCase() === 'start') {
      const start = this.editorForm.value.start;
      const end = this.editorForm.value.end;
      if (start) {
        const dStart = new Date(start);
        const dEnd = new Date(end);
        if (dEnd.getTime() < dStart.getTime()) {
          this.editorForm.controls['end'].setValue(dStart);
        }
      }
    }
  }
  
  processNewRequest() {
    if (this.selected && (this.selected.id === '' || this.selected.id === 'new') 
      && this.editorForm.valid && this.employee) {
      let start = new Date(this.editorForm.value.start);
      start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), 
        start.getDate()));
      let end = new Date(this.editorForm.value.end);
      end = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));
      const code = this.editorForm.value.primarycode;
      this.dialogService.showSpinner();
      this.authService.statusMessage = "Processing leave request";
      this.empService.addNewLeaveRequest(this.employee.id, start, end, code, 
        this.editorForm.value.comment)
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.setRequests();
              if (data.leaverequest) {
                this.selected = new LeaveRequest(data.leaverequest);
              } else if (this.employee.requests) {
                this.employee.requests.forEach(req => {
                  if (req.startdate.getFullYear() === start.getFullYear()
                    && req.startdate.getMonth() === start.getMonth()
                    && req.startdate.getDate() === start.getDate()
                    && req.enddate.getFullYear() === end.getFullYear()
                    && req.enddate.getMonth() === end.getMonth()
                    && req.enddate.getDate() === end.getDate()) {
                      this.selected = new LeaveRequest(req);
                    }
                });
              }
              this.empService.replaceEmployee(this.employee);
            }
            if (this.selected) {
              this.editorForm.controls['leaverequest'].setValue(this.selected.id);
            }
            this.setCurrent();
          }
          this.authService.statusMessage = "Leave Request processing complete";
          this.changed.emit(new Employee(this.employee));
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }
  
  getCurrentLeaveRequestDate(): string {
    if (this.selected) {
      return `${this.selected.requestDate.getMonth() + 1}/`
        + `${this.selected.requestDate.getDate()}/`
        + `${this.selected.requestDate.getFullYear()}`;
    }
    return '-';
  }

  getApprovedBy(): string {
    if (this.selected && this.selected.approvedby !== '') {
      let answer = '';
      const site = this.siteService.getSite();
      if (site && site.employees && site.employees.length > 0) {
        site.employees.forEach(emp => {
          if (this.selected && emp.id === this.selected.approvedby) {
            answer = emp.name.getFullName();
          }
        });
      }
      return answer;
    }
    return '-';
  }

  getApprovedDate(): string {
    if (this.selected && this.selected.approvedby !== '') {
      return `${this.selected.approvalDate.getMonth() + 1}/`
        + `${this.selected.approvalDate.getDate()}/`
        + `${this.selected.approvalDate.getFullYear()}`;
    }
    return '-';
  }

  processDayChange(value: string) {
    if (this.selected && value !== '' && this.selected.id !== '') {
      this.authService.statusMessage = "Updating Leave Request Date change";
      this.empService.updateLeaveRequest(this.employee.id, 
        this.selected.id, 'day', value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee) {
                data.employee.requests.forEach(req => {
                  if (this.selected && this.selected.id === req.id) {
                    this.selected = new LeaveRequest(req);
                    this.setCurrent();
                  }
                });
                this.employee = data.employee;
                this.editorForm.controls['leaverequest'].setValue(this.selected?.id)
                this.empService.replaceEmployee(data.employee);
              }
            }
            this.authService.statusMessage = "Update complete";
            this.changed.emit(new Employee(this.employee));
          },
          error: (err: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
    }
  }

  deleteRequest() {
    const dialogRef = this.dialog.open(
      EmployeeLeaveRequestDeletionDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (this.selected && result.toLowerCase() === 'yes') {
        this.dialogService.showSpinner();
        const reqid = this.selected.id;
        this.clearRequest();
        if (reqid) {
          this.authService.statusMessage = "Deleting Leave Request";
          this.empService.deleteLeaveRequest(this.employee.id, reqid)
            .subscribe({
              next: (data: EmployeeResponse) => {
                this.dialogService.closeSpinner();
                if (data && data !== null) {
                  if (data.employee) {
                    this.employee = data.employee;
                    this.selected = undefined
                    this.editorForm.controls['leaverequest'].setValue('');
                    this.empService.replaceEmployee(this.employee);
                  }
                  this.setCurrent();
                }
                this.authService.statusMessage = "Deletion Complete";
                this.changed.emit(new Employee(this.employee));
              },
              error: (err: EmployeeResponse) => {
                this.dialogService.closeSpinner();
                this.authService.statusMessage = err.exception;
              }
            });
        }
      }
    });
  }

  clearRequest() {
    this.selected = undefined;
    this.setCurrent();
  }

  approveLeaveRequest() {
    this.authService.statusMessage = "Approving Leave Request";
    this.dialogService.showSpinner();
    const iEmp = this.empService.getEmployee();
    if (this.selected && iEmp) {
      this.empService.updateLeaveRequest(this.employee.id, this.selected.id, 
      "approve", iEmp.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.employee.requests.forEach(req => {
                if (this.selected && this.selected.id === req.id) {
                  this.selected = new LeaveRequest(req)
                }
              });
              this.empService.replaceEmployee(this.employee);
            }
            this.setCurrent();
          }
          this.authService.statusMessage = "Approval Complete";
          this.changed.emit(new Employee(this.employee));
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  unapproveLeaveRequest() {
    const dialogRef = this.dialog.open(EmployeeLeaveRequestUnapproveDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== '') {
        this.authService.statusMessage = "Un-Approving Leave Request";
        this.dialogService.showSpinner();
        const iEmp = this.empService.getEmployee();
        if (this.selected && iEmp) {
          this.empService.updateLeaveRequest(this.employee.id, this.selected.id, 
            "unapprove", result).subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee) {
                  this.employee = data.employee;
                  this.employee.requests.forEach(req => {
                    if (this.selected && this.selected.id === req.id) {
                      this.selected = new LeaveRequest(req)
                    }
                  });
                  this.empService.replaceEmployee(this.employee);
                }
                this.setCurrent();
              }
              this.authService.statusMessage = "Un-Approval Complete";
              this.changed.emit(new Employee(this.employee));
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
        }
      }
    });
  }

  submitForApproval() {
    this.authService.statusMessage = "Submitting for approval";
    this.dialogService.showSpinner();
    const iEmp = this.empService.getEmployee();
    if (this.selected && iEmp) {
      this.empService.updateLeaveRequest(this.employee.id, this.selected.id, 
      "requested", iEmp.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.employee.requests.forEach(req => {
                if (this.selected && this.selected.id === req.id) {
                  this.selected = new LeaveRequest(req)
                }
              });
              this.empService.replaceEmployee(this.employee);
            }
            this.setCurrent();
          }
          this.authService.statusMessage = "Submit for Approval Complete";
          this.changed.emit(new Employee(this.employee));
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  selectorWidth(): string {
    let width = (window.innerWidth - 100 > 400) ? 400 : window.innerWidth - 100;
    return `width: ${width}px;`
  }

  addComment() {
    const newComment = this.commentForm.value.comment;
    if (this.selected && newComment !== '') {
      this.dialogService.showSpinner()
      this.empService.updateLeaveRequest(this.employee.id, this.selected.id, 
        'comment', newComment).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.employee.requests.forEach(req => {
                if (this.selected && this.selected.id === req.id) {
                  this.selected = new LeaveRequest(req)
                }
              });
              this.empService.replaceEmployee(this.employee);
            }
            this.setCurrent();
          }
          this.authService.statusMessage = "Added Comment";
          this.changed.emit(new Employee(this.employee));
        },
        error: (err: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      })
    }
  }
 }
