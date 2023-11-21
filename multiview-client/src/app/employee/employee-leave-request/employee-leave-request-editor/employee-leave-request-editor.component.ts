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
  @Output() changed = new EventEmitter<Employee>();

  requests: LeaveRequest[] = [];
  selected: LeaveRequest = new LeaveRequest();
  public selectionForm: FormGroup;
  editorForm: FormGroup;
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
    this.selectionForm = this.fb.group({
      leaverequest: ['', [Validators.required]],
    });
    this.editorForm = this.fb.group({
      start: [new Date(), [Validators.required]],
      end: [new Date(), [Validators.required]],
      primarycode: ['V', [Validators.required]],
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

  setRequests() {
    console.log('requests');
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
    const reqID = this.selectionForm.value.leaverequest;
    this.ptohours = 0.0;
    this.holidayhours = 0.0;
    this.approver = false;
    if (reqID === '') {
      this.selected = new LeaveRequest();
    } else if (reqID === '0') {
      this.selected = new LeaveRequest();
      this.selected.id = 'new';
    } else {
      this.selected = new LeaveRequest();
      this.requests.forEach(req => {
        if (req.id === reqID) {
          this.selected = new LeaveRequest(req);
        }
      });
    }
    if (this.selected) {
      this.editorForm.controls['start'].setValue(this.selected.startdate);
      this.editorForm.controls['end'].setValue(this.selected.enddate);
      this.editorForm.controls['primarycode'].setValue(this.selected.primarycode);
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
      this.selected.requesteddays.forEach(day => {
        if (day.code.toLowerCase() === 'v') {
          this.ptohours += day.hours;
        } else if (day.code.toLowerCase() === 'h') {
          this.holidayhours += day.hours;
        }
      });
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
        case "end":
          field = "dates";
          const start = this.editorForm.value.start;
          const end = this.editorForm.value.end;
          if (start && end) {
            const dStart = new Date(start);
            const dEnd = new Date(end);
            value = `${dStart.getUTCFullYear()}-`
              + `${(dStart.getUTCMonth() < 9) ? '0' : ''}${dStart.getUTCMonth() + 1}-`
              + `${(dStart.getUTCDate() < 10) ? '0' : ''}${dStart.getUTCDate()}|`
              + `${dEnd.getUTCFullYear()}-`
              + `${(dEnd.getUTCMonth() < 9)? '0' : ''}${dEnd.getUTCMonth() + 1}-`
              + `${(dEnd.getUTCDate() < 10) ? '0' : ''}${dEnd.getUTCDate()}`;
          }
          break;
        case "code":
          value = this.editorForm.value.primarycode;
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
                const iEmp = this.empService.getEmployee();
                if (iEmp && iEmp.id === this.employee.id) {
                  this.empService.setEmployee(data.employee);
                }
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
    }
  }
  
  processNewRequest() {
    if (this.selected && (this.selected.id === '' || this.selected.id === 'new') 
      && this.editorForm.valid && this.employee) {
      let start = new Date(this.editorForm.value.start);
      let end = new Date(this.editorForm.value.end);
      const code = this.editorForm.value.primarycode;
      this.dialogService.showSpinner();
      this.authService.statusMessage = "Processing leave request";
      this.empService.addNewLeaveRequest(this.employee.id, start, end, code)
      .subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              if (this.employee.requests) {
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
              this.setRequests();
              const iEmp = this.empService.getEmployee();
              if (iEmp && iEmp.id === this.employee.id) {
                this.empService.setEmployee(data.employee);
              }
            }
            if (this.selected) {
              this.selectionForm.controls['leaverequest'].setValue(this.selected.id);
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
    return 'NEW';
  }

  getApprovedBy(): string {
    if (this.selected && this.selected.approvedby !== '') {
      let answer = '';
      const site = this.siteService.getSite();
      if (site && site.employees && site.employees.length > 0) {
        site.employees.forEach(emp => {
          if (emp.id === this.selected.approvedby) {
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
    if (value !== '' && this.selected.id !== '') {
      this.authService.statusMessage = "Updating Leave Request Date change";
      this.empService.updateLeaveRequest(this.employee.id, 
        this.selected.id, 'day', value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee) {
                this.employee = data.employee;
                this.employee.requests.forEach(req => {
                  if (this.selected.id === req.id) {
                    this.selected = new LeaveRequest(req)
                  }
                });
                
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
  }

  deleteRequest() {
    const dialogRef = this.dialog.open(
      EmployeeLeaveRequestDeletionDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
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
                    this.selected = new LeaveRequest();
                    const iEmp = this.empService.getEmployee();
                    if (iEmp && iEmp.id === this.employee.id) {
                      this.empService.setEmployee(this.employee);
                    }
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
    this.selected = new LeaveRequest();
    this.editorForm.controls["start"].setValue(new Date())
    this.editorForm.controls["end"].setValue(new Date());
    this.editorForm.controls["primarycode"].setValue('V');
  }

  approveLeaveRequest() {
    this.authService.statusMessage = "Approving Leave Request";
    this.dialogService.showSpinner();
    const iEmp = this.empService.getEmployee();
    if (iEmp) {
      this.empService.updateLeaveRequest(this.employee.id, this.selected.id, 
      "approve", iEmp.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.employee.requests.forEach(req => {
                if (this.selected.id === req.id) {
                  this.selected = new LeaveRequest(req)
                }
              });
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
        if (iEmp) {
          this.empService.updateLeaveRequest(this.employee.id, this.selected.id, 
            "unapprove", result).subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee) {
                  this.employee = data.employee;
                  this.employee.requests.forEach(req => {
                    if (this.selected.id === req.id) {
                      this.selected = new LeaveRequest(req)
                    }
                  });
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
    if (iEmp) {
      this.empService.updateLeaveRequest(this.employee.id, this.selected.id, 
      "requested", iEmp.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.employee.requests.forEach(req => {
                if (this.selected.id === req.id) {
                  this.selected = new LeaveRequest(req)
                }
              });
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
 }
