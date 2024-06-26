import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { LeaveRequest } from 'src/app/models/employees/leave';
import { Workcode } from 'src/app/models/teams/workcode';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-leave-request-form',
  templateUrl: './leave-request-form.component.html',
  styleUrls: ['./leave-request-form.component.scss']
})
export class LeaveRequestFormComponent {
  private _employee: Employee = new Employee();
  @Input()
  public set employee(emp: IEmployee) {
    if (emp.id !== this._employee.id) {
      this.currentLeaveRequest = undefined;
    }
    this._employee = new Employee(emp);
    this.setCurrent();
  }
  get employee(): Employee {
    return this._employee;
  }
  @Output() changed = new EventEmitter<Employee>();

  currentLeaveRequests: LeaveRequest[] = [];
  currentLeaveRequest?: LeaveRequest = undefined;
  leaveList: Workcode[];
  approver: boolean = false;

  constructor(
    protected authService: AuthService,
    protected empService: EmployeeService,
    protected siteService: SiteService,
    protected teamService: TeamService,
    protected dialogService: DialogService,
    private fb: FormBuilder,
    protected dialog: MatDialog
  ) { 
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
    let now = new Date();
    now = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    this.currentLeaveRequests = [];
    if (this.employee && this.employee.requests) {
      this.employee.requests.forEach(lr => {
        const lvReq = new LeaveRequest(lr);
        if (lvReq.enddate.getTime() >= now.getTime()) {
          this.currentLeaveRequests.push(lvReq);
        }
      });
    }
    this.currentLeaveRequests = this.currentLeaveRequests.sort((a,b) => b.compareTo(a));
  }

  getUTCDateString(date: Date): string {
    return `${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}`;
  }

  getCurrentLeaveRequestDate(): string {
    if (this.currentLeaveRequest) {
      return `${this.currentLeaveRequest.requestDate.getUTCMonth() + 1}/`
        + `${this.currentLeaveRequest.requestDate.getUTCDate()}/`
        + `${this.currentLeaveRequest.requestDate.getUTCFullYear()}`;
    }
    return 'NEW';
  }

  setSelected(id: string) {
    if (id === 'new') {
      let now = new Date();
      now = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
        0, 0, 0, 0))
      this.dialogService.showSpinner();
      this.authService.statusMessage = "Processing leave request";
      this.empService.addNewLeaveRequest(this.employee.id, now, now, 'V')
        .subscribe({
          next: (data: EmployeeResponse) => {
            this.dialogService.closeSpinner();
            if (data && data !== null) {
              if (data.employee) {
                this.employee = data.employee;
                if (this.employee.requests) {
                  this.employee.requests.forEach(req => {
                    if (req.startdate.getUTCFullYear() === now.getUTCFullYear() 
                      && req.startdate.getUTCMonth() === now.getUTCMonth()
                      && req.startdate.getUTCDate() === now.getUTCDate()
                      && req.primarycode === 'V') {
                      this.currentLeaveRequest = new LeaveRequest(req);
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
    } else {
      this.currentLeaveRequests.forEach(lr => {
        if (lr.id === id) {
          this.currentLeaveRequest = new LeaveRequest(lr);
        }
      });
    }
  }

  changedEmployee(iEmp: Employee) {
    this.changed.emit(iEmp);
    this.employee = iEmp;
    this.setCurrent();
  }

  getButtonClass(id: string): string {
    let answer = 'employee';
    if (this.currentLeaveRequest && this.currentLeaveRequest.id === id) {
      answer += " active";
    }
    return answer;
  }
}
