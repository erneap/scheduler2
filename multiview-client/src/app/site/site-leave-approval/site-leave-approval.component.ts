import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeLeaveRequestDeletionDialogComponent } from 'src/app/employee/employee-leave-request/employee-leave-request-deletion-dialog/employee-leave-request-deletion-dialog.component';
import { EmployeeLeaveRequestUnapproveDialogComponent } from 'src/app/employee/employee-leave-request/employee-leave-request-unapprove-dialog/employee-leave-request-unapprove-dialog.component';
import { Employee } from 'src/app/models/employees/employee';
import { LeaveRequest } from 'src/app/models/employees/leave';
import { Site } from 'src/app/models/sites/site';
import { Team } from 'src/app/models/teams/team';
import { Workcode } from 'src/app/models/teams/workcode';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { EmployeeLeaveRequestItem } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-site-leave-approval',
  templateUrl: './site-leave-approval.component.html',
  styleUrls: ['./site-leave-approval.component.scss'],
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
export class SiteLeaveApprovalComponent {
  site: Site;
  leaveList: EmployeeLeaveRequestItem[] = []
  selectionForm: FormGroup;
  editorForm: FormGroup;
  selected: EmployeeLeaveRequestItem = new EmployeeLeaveRequestItem(0, '', '', 
    new LeaveRequest())
  employee: Employee = new Employee();
  ptohours: number = 0;
  holidayhours: number = 0;
  workcodes: Workcode[] = [];
  approver: boolean = false;
  stdHours: number = 10.0;

  constructor(
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.site = new Site();
    const iSite = this.siteService.getSite();
    if (iSite) {
      this.site = new Site(iSite);
    }
    const iTeam = this.teamService.getTeam();
    if (iTeam) {
      const team = new Team(iTeam);
      team.workcodes.forEach(wc => {
        if (wc.isLeave) {
          this.workcodes.push(new Workcode(wc));
        }
      });
    }
    this.selectionForm = this.fb.group({
      leaverequest: [0, [Validators.required]],
    });
    this.editorForm = this.fb.group({
      start: [new Date(), [Validators.required]],
      end: [new Date(), [Validators.required]],
      primarycode: ['V', [Validators.required]],
    });
    this.setLeaveRequests();
  }

  setLeaveRequests() {
    this.leaveList = [];
    let i=1;
    if (this.site.employees) {
      this.site.employees.forEach(emp => {
        emp.requests.forEach(req => {
          if (req.approvedby === '' && req.status.toLowerCase() === 'requested') {
            const lvr = new EmployeeLeaveRequestItem(i++, emp.id, 
              emp.name.last, req);
            this.leaveList.push(lvr);
          }
        });
      });
    }
    this.leaveList.sort((a,b) => a.compareTo(b));
  }

  setCurrent() {
    const reqID = this.selectionForm.value.leaverequest;
    this.ptohours = 0.0;
    this.holidayhours = 0.0;
    this.approver = false;
    if (reqID === 0) {
      this.selected = new EmployeeLeaveRequestItem(0, '', '', new LeaveRequest());
    } else {
      this.selected = new EmployeeLeaveRequestItem(0, '', '', new LeaveRequest());
      this.leaveList.forEach(req => {
        if (req.id === reqID) {
          this.selected = new EmployeeLeaveRequestItem(req.id, req.employeeid, 
            req.lastName, req.leaveRequest);
        }
      });
      if (this.selected.employeeid !== '' && this.site.employees) {
        this.site.employees.forEach(emp => {
          if (emp.id === this.selected.employeeid) {
            this.employee = new Employee(emp);
          }
        })
      }
    }
    if (this.selected) {
      this.editorForm.controls['start'].setValue(this.selected.leaveRequest.startdate);
      this.editorForm.controls['end'].setValue(this.selected.leaveRequest.enddate);
      this.editorForm.controls['primarycode'].setValue(this.selected.leaveRequest.primarycode);
      const tEmp = this.authService.getUser();
      if (tEmp) {
        if (this.selected.id > 0 && this.selected.employeeid !== tEmp.id 
          && this.selected.leaveRequest.status.toLowerCase() === "requested"
          && this.selected.leaveRequest.approvedby === ''
          && (this.authService.hasRole('scheduler')
          || this.authService.hasRole('siteleader'))) {
          this.approver = true;
        }
      }
      this.selected.leaveRequest.requesteddays.forEach(day => {
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

  getRequestLabel(req: EmployeeLeaveRequestItem): string {
    const start = this.getDateString(req.leaveRequest.startdate);
    const end = this.getDateString(req.leaveRequest.enddate);
    if (start === end) {
      return `(${req.lastName}) ${start}`;
    }
    return `(${req.lastName}) ${start} - ${end}`;
  }

  processChange(field: string) {
    if (this.employee && this.selected && this.selected.leaveRequest.id !== '') {
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
          this.selected.leaveRequest.id, field, value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.authService.statusMessage = "Updating Leave Request "
              + "Primary Code change";
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee && this.site.employees) {
                let found = false;
                for (let i=0; i < this.site.employees.length && !found; i++) {
                  if (this.site.employees[i].id === this.selected.employeeid) {
                    this.site.employees[i] = new Employee(data.employee);
                    this.siteService.setSite(this.site);
                    found = true;
                  }
                }
              }
              this.setLeaveRequests()
              if (this.leaveList.length > 0) {
                this.selectionForm.controls['leaverequest']
                  .setValue(this.leaveList[0].id);
              } else {
                this.selectionForm.controls['leaverequest'].setValue(0);
              }
              this.setCurrent();
            }
          },
          error: (err: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    }
  }
  
  processDayChange(value: string) {
    if (value !== '' && this.selected.leaveRequest.id !== '') {
      this.authService.statusMessage = "Updating Leave Request Date change";
      this.empService.updateLeaveRequest(this.employee.id, 
        this.selected.leaveRequest.id, 'day', value)
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee && this.site.employees) {
                let found = false;
                for (let i=0; i < this.site.employees.length && !found; i++) {
                  if (this.site.employees[i].id === this.selected.employeeid) {
                    this.site.employees[i] = new Employee(data.employee);
                    this.siteService.setSite(this.site);
                    found = true;
                  }
                }
              }
              this.setLeaveRequests()
              if (this.leaveList.length > 0) {
                this.selectionForm.controls['leaverequest']
                  .setValue(this.leaveList[0].id);
              } else {
                this.selectionForm.controls['leaverequest'].setValue(0);
              }
              this.setCurrent();
            }
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
        const reqid = this.selected.leaveRequest.id;
        this.clearRequest();
        if (reqid) {
          this.authService.statusMessage = "Deleting Leave Request";
          this.empService.deleteLeaveRequest(this.employee.id, reqid)
            .subscribe({
              next: (data: EmployeeResponse) => {
                this.dialogService.closeSpinner();
                if (data && data !== null) {
                  if (data.employee && this.site.employees) {
                    let found = false;
                    for (let i=0; i < this.site.employees.length && !found; i++) {
                      if (this.site.employees[i].id === this.selected.employeeid) {
                        this.site.employees[i] = new Employee(data.employee);
                        this.siteService.setSite(this.site);
                        found = true;
                      }
                    }
                  }
                  this.setLeaveRequests()
                  if (this.leaveList.length > 0) {
                    this.selectionForm.controls['leaverequest']
                      .setValue(this.leaveList[0].id);
                  } else {
                    this.selectionForm.controls['leaverequest'].setValue(0);
                  }
                  this.setCurrent();
                }
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
    this.selected = new EmployeeLeaveRequestItem(0, '', '', new LeaveRequest());
    this.editorForm.controls["start"].setValue(new Date())
    this.editorForm.controls["end"].setValue(new Date());
    this.editorForm.controls["primarycode"].setValue('V');
  }

  getCurrentLeaveRequestDate(): string {
    if (this.selected) {
      return `${this.selected.leaveRequest.requestDate.getMonth() + 1}/`
        + `${this.selected.leaveRequest.requestDate.getDate()}/`
        + `${this.selected.leaveRequest.requestDate.getFullYear()}`;
    }
    return 'NEW';
  }

  getApprovedBy(): string {
    if (this.selected && this.selected.leaveRequest.approvedby !== '') {
      let answer = '';
      const site = this.siteService.getSite();
      if (site && site.employees && site.employees.length > 0) {
        site.employees.forEach(emp => {
          if (emp.id === this.selected.leaveRequest.approvedby) {
            answer = emp.name.getFullName();
          }
        });
      }
      return answer;
    }
    return '-';
  }

  getApprovedDate(): string {
    if (this.selected && this.selected.leaveRequest.approvedby !== '') {
      return `${this.selected.leaveRequest.approvalDate.getMonth() + 1}/`
        + `${this.selected.leaveRequest.approvalDate.getDate()}/`
        + `${this.selected.leaveRequest.approvalDate.getFullYear()}`;
    }
    return '-';
  }
  
  approveLeaveRequest() {
    this.dialogService.showSpinner();
    const iEmp = this.empService.getEmployee();
    if (iEmp) {
      this.empService.updateLeaveRequest(this.selected.employeeid, 
        this.selected.leaveRequest.id, 
        "approve", iEmp.id).subscribe({
        next: (data: EmployeeResponse) => {
          this.dialogService.closeSpinner();
          if (data && data !== null) {
            if (data.employee && this.site.employees) {
              let found = false;
              for (let i=0; i < this.site.employees.length && !found; i++) {
                if (this.site.employees[i].id === this.selected.employeeid) {
                  this.site.employees[i] = new Employee(data.employee);
                  this.siteService.setSite(this.site);
                  found = true;
                }
              }
            }
            this.setLeaveRequests()
            if (this.leaveList.length > 0) {
              this.selectionForm.controls['leaverequest']
                .setValue(this.leaveList[0].id);
            } else {
              this.selectionForm.controls['leaverequest'].setValue(0);
            }
            this.setCurrent();
          }
          this.authService.statusMessage = "Approval Complete";
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
          this.empService.updateLeaveRequest(this.selected.employeeid, 
            this.selected.leaveRequest.id, 
            "unapprove", result).subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee && this.site.employees) {
                  let found = false;
                  for (let i=0; i < this.site.employees.length && !found; i++) {
                    if (this.site.employees[i].id === this.selected.employeeid) {
                      this.site.employees[i] = new Employee(data.employee);
                      this.siteService.setSite(this.site);
                      found = true;
                    }
                  }
                }
                this.setLeaveRequests()
                if (this.leaveList.length > 0) {
                  this.selectionForm.controls['leaverequest']
                    .setValue(this.leaveList[0].id);
                } else {
                  this.selectionForm.controls['leaverequest'].setValue(0);
                }
                this.setCurrent();
              }
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

  selectorWidth(): string {
    let width = (window.innerWidth - 100 > 400) ? 400 : window.innerWidth - 100;
    return `width: ${width}px;`
  }
}
