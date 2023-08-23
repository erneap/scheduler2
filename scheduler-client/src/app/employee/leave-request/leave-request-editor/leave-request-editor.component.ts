import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ILeaveRequest, LeaveRequest } from 'src/app/models/employees/leave';
import { Workcode } from 'src/app/models/teams/workcode';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';
import { DeleteLeaveRequestDialogComponent } from '../delete-leave-request-dialog/delete-leave-request-dialog.component';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-leave-request-editor',
  templateUrl: './leave-request-editor.component.html',
  styleUrls: ['./leave-request-editor.component.scss']
})
export class LeaveRequestEditorComponent {
  private _employee: Employee = new Employee();
  private _request: LeaveRequest = new LeaveRequest();
  private _approver: boolean = false;
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
  }
  get employee(): Employee {
    return this._employee;
  }
  @Input()
  public set request(iReq: ILeaveRequest) {
    this._request = new LeaveRequest(iReq);
    this.setCurrent();
  }
  get request(): LeaveRequest {
    return this._request;
  }
  @Input()
  public set approver(show: boolean) {
    this._approver = show;
  }
  get approver(): boolean {
    return this._approver;
  }
  @Output() changed = new EventEmitter<Employee>();
  editorForm: FormGroup;
  leaveList: Workcode[];
  draft: boolean = false;
  ptohours: number = 0;
  holidayhours: number = 0;

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
      start: [new Date(), [Validators.required]],
      end: [new Date(), [Validators.required]],
      primarycode: ['V', [Validators.required]],
    });
    this.leaveList = [];
    const team = this.teamService.getTeam();
    if (team) {
      team.workcodes.forEach(wc => {
        if (wc.isLeave) {
          this.leaveList.push(new Workcode(wc));
        }
      });
      this.leaveList.sort((a,b) => a.compareTo(b));
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

  setCurrent() {
    this.ptohours = 0.0;
    this.holidayhours = 0.0;
    this.approver = false;
    this.editorForm.controls['start'].setValue(this.request.startdate);
    this.editorForm.controls['end'].setValue(this.request.enddate);
    this.editorForm.controls['primarycode'].setValue(this.request.primarycode);
    this.draft = (this.request.status.toLowerCase() === 'draft')
    const tEmp = this.authService.getUser();
    if (tEmp) {
      if (this.request.id !== '' && this.employee.id !== tEmp.id 
        && this.request.status.toLowerCase() === "requested"
        && this.request.approvedby === ''
        && (this.authService.hasRole('scheduler')
        || this.authService.hasRole('siteleader'))) {
        this.approver = true;
      }
    }
    this.request.requesteddays.forEach(day => {
      if (day.code.toLowerCase() === 'v') {
        this.ptohours += day.hours;
      } else if (day.code.toLowerCase() === 'h') {
        this.holidayhours += day.hours;
      }
    })
  }

  getDateString(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  getLeaveCodes(): Workcode[] {
    let answer: Workcode[] = [];
    const team = this.teamService.getTeam();
    if (team) {
      team.workcodes.forEach(wc => {
        if (wc.isLeave) {
          answer.push(new Workcode(wc));
        }
      })
    }
    answer.sort((a,b) => a.compareTo(b));
    return answer;
  }

  getCurrentLeaveRequestDate(): string {
    if (this.request) {
      return `${this.request.requestDate.getMonth() + 1}/`
        + `${this.request.requestDate.getDate()}/`
        + `${this.request.requestDate.getFullYear()}`;
    }
    return 'NEW';
  }

  getApprovedBy(): string {
    if (this.request && this.request.approvedby !== '') {
      let answer = '';
      const site = this.siteService.getSite();
      if (site && site.employees && site.employees.length > 0) {
        site.employees.forEach(emp => {
          if (emp.id === this.request.approvedby) {
            answer = emp.name.getFullName();
          }
        });
      }
      return answer;
    }
    return '-';
  }

  getApprovedDate(): string {
    if (this.request && this.request.approvedby !== '') {
      return `${this.request.approvalDate.getMonth() + 1}/`
        + `${this.request.approvalDate.getDate()}/`
        + `${this.request.approvalDate.getFullYear()}`;
    }
    return '-';
  }

  processNewRequest() {
    if (this.editorForm.valid && this.employee) {
      const start = this.editorForm.value.start;
      const end = this.editorForm.value.end;
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
                        this.request = new LeaveRequest(req);
                      }
                  });
                }
                const iEmp = this.empService.getEmployee();
                if (iEmp && iEmp.id === this.employee.id) {
                  this.empService.setEmployee(data.employee);
                }
              }
              this.setCurrent();
              const site = this.siteService.getSite()
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

  processChange(field: string) {
    if (this._employee && this.request.id !== '') {
      let value = '';
      switch (field.toLowerCase()) {
        case "start":
        case "end":
          field = "dates";
          const start = this.editorForm.value.start;
          const end = this.editorForm.value.end;
          value = `${start.getFullYear()}-`
            + `${(start.getMonth() < 9) ? '0' : ''}${start.getMonth() + 1}-`
            + `${(start.getDate() < 10) ? '0' : ''}${start.getDate()}|`
            + `${end.getFullYear()}-`
            + `${(end.getMonth() < 9)? '0' : ''}${end.getMonth() + 1}-`
            + `${(end.getDate() < 10) ? '0' : ''}${end.getDate()}`;
          break;
        case "code":
          value = this.editorForm.value.primarycode;
          break;
      }
      this.dialogService.showSpinner();
      this.empService.updateLeaveRequest(this.employee.id, 
        this.request.id, field, value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.authService.statusMessage = "Updating Leave Request "
              + "Primary Code change";
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee) {
                this.employee = data.employee;
                this.employee.requests.forEach(req => {
                  if (this.request.id === req.id) {
                    this.request = new LeaveRequest(req)
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

  processDayChange(value: string) {
    if (value !== '' && this.request.id !== '') {
      this.authService.statusMessage = "Updating Leave Request Date change";
      this.empService.updateLeaveRequest(this.employee.id, 
        this.request.id, 'day', value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee) {
                this.employee = data.employee;
                this.employee.requests.forEach(req => {
                  if (this.request.id === req.id) {
                    this.request = new LeaveRequest(req)
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
    const dialogRef = this.dialog.open(DeleteLeaveRequestDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.toLowerCase() === 'yes') {
        this.dialogService.showSpinner();
        const reqid = this.request.id;
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
                    this.employee.requests.forEach(req => {
                      if (this.request.id === req.id) {
                        this.request = new LeaveRequest(req)
                      }
                    });
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
    this.request = new LeaveRequest();
    this.editorForm.controls["start"].setValue(new Date())
    this.editorForm.controls["end"].setValue(new Date());
    this.editorForm.controls["primarycode"].setValue('V');
  }

  approveLeaveRequest() {
    this.authService.statusMessage = "Approving Leave Request";
    this.dialogService.showSpinner();
    const iEmp = this.empService.getEmployee();
    if (iEmp) {
      this.empService.updateLeaveRequest(this.employee.id, this.request.id, 
      "approve", iEmp.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.employee.requests.forEach(req => {
                if (this.request.id === req.id) {
                  this.request = new LeaveRequest(req)
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

  submitForApproval() {
    this.authService.statusMessage = "Submitting for approval";
    this.dialogService.showSpinner();
    const iEmp = this.empService.getEmployee();
    if (iEmp) {
      this.empService.updateLeaveRequest(this.employee.id, this.request.id, 
      "requested", iEmp.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee) {
              this.employee = data.employee;
              this.employee.requests.forEach(req => {
                if (this.request.id === req.id) {
                  this.request = new LeaveRequest(req)
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
}
