import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Variation } from '../models/employees/assignments';
import { Employee, IEmployee } from '../models/employees/employee';
import { LeaveDay } from '../models/employees/leave';
import { ChangeAssignmentRequest, EmployeeLaborCodeRequest, 
  EmployeeLeaveDayRequest, EmployeeLeaveRequest, EmployeeResponse, 
  NewEmployeeAssignment, NewEmployeeRequest, NewEmployeeVariation, 
  UpdateRequest, LeaveBalanceRequest, CreateUserAccount, Message, EmployeeContactUpdate, EmployeeSpecialtyUpdate, EmployeeSpecialtiesUpdate, EmployeeWorkResponse } from '../models/web/employeeWeb';
import { CreateSiteEmployeeLeaveBalances, SiteResponse } from '../models/web/siteWeb';
import { CacheService } from './cache.service';
import { TeamService } from './team.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends CacheService {
  showHolidays: boolean = true;
  interval: any;

  constructor(
    protected teamService: TeamService,
    private httpClient: HttpClient
  ) 
  { 
    super();
  }

  getEmployee(): Employee | undefined {
    const iEmp = this.getItem<IEmployee>("current-employee");
    if (iEmp) {
      const emp = new Employee(iEmp);
      // find the employee's company and see if they provide holidays.
      const team = this.teamService.getTeam();
      if (team) {
        team.companies.forEach(co => {
          if (emp.companyinfo.company.toLowerCase() === co.id.toLowerCase()) {
            this.showHolidays = (co.holidays.length > 0);
          }
        })
      }
      return emp;
    }
    return undefined;
  }

  setEmployee(iEmp: IEmployee): void {
    const emp = new Employee(iEmp);
    // find the employee's company and see if they provide holidays.
    const team = this.teamService.getTeam();
    if (team) {
      team.companies.forEach(co => {
        if (emp.companyinfo.company.toLowerCase() === co.id.toLowerCase()) {
          this.showHolidays = (co.holidays.length > 0);
        }
      })
    }
    this.setItem('current-employee', emp);
  }

  startRenewal() {
    const minutes = 60;
    this.interval = setInterval(() => {
      this.processEmployee()
    }, minutes * 60 * 1000);
  }

  processEmployee() {
    const emp = this.getEmployee();
    if (emp) {
      this.retrieveEmployee(emp.id).subscribe({
        next: resp => {
          if (resp.employee) {
            this.setEmployee(resp.employee);
          }
        },
        error: err => {
          console.log(err.exception);
        }
      })
    }
  }

  clearRenewal() {
    if (this.interval && this.interval !== null) {
      clearInterval(this.interval);
    }
  }

  getEmployeeID(): string {
    const emp = this.getEmployee();
    if (emp) {
      return emp.id;
    }
    return '';
  }

  retrieveEmployee(id: string): Observable<EmployeeResponse> {
    const url = `/scheduler/api/v2/employee/${id}`;
    return this.httpClient.get<EmployeeResponse>(url);
  }

  retrieveEmployeeWork(id: string, year: number): Observable<EmployeeWorkResponse> {
    const url = `/scheduler/api/v2/employee/work/${id}/${year}`;
    return this.httpClient.get<EmployeeWorkResponse>(url);
  }

  updateEmployee(empID: string, field: string, value: string): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee';
    const data: UpdateRequest = {
      id: empID,
      field: field,
      value: value,
    };
    return this.httpClient.put<EmployeeResponse>(url, data);
  }

  deleteEmployee(empID: string): Observable<Message> {
    const url = `/scheduler/api/v2/employee/${empID}`;
    return this.httpClient.delete<Message>(url);
  }

  addUserAccount(empID: string, email: string, password: string): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/account';
    const data: CreateUserAccount = {
      id: empID,
      emailAddress: email,
      firstName: '',
      middleName: '',
      lastName: '',
      password: password,
    }
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  addNewLeaveRequest(empid: string, start: Date, end: Date, 
    code: string): Observable<EmployeeResponse> {
    const data: EmployeeLeaveRequest = {
      employee: empid,
      code: code,
      startdate: start,
      enddate: end,
    };
    const url = '/scheduler/api/v2/employee/request';
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  updateLeaveRequest(empid: string, reqid: string, field: string, value: string): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/request';
    const data: UpdateRequest = {
      id: empid,
      optional: reqid,
      field: field,
      value: value,
    }
    return this.httpClient.put<EmployeeResponse>(url, data)
  }

  deleteLeaveRequest(empid: string, reqid: string): 
    Observable<EmployeeResponse> {
    const url = `/scheduler/api/v2/employee/request/${empid}/${reqid}`;
    return this.httpClient.delete<EmployeeResponse>(url);
  }

  addEmployee(employee: Employee, passwd: string, teamid: string, siteid: string): 
  Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee';
    const empRequest: NewEmployeeRequest = {
      employee: employee,
      password: passwd,
      team: teamid,
      site: siteid,
    }
    return this.httpClient.post<EmployeeResponse>(url, empRequest);
  }

  AddAssignment(empID: string, siteID: string, wkctr: string, start: Date, 
    days: number): Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/assignment';
    const data: NewEmployeeAssignment = {
      employee: empID,
      site: siteID,
      workcenter: wkctr,
      start: start,
      scheduledays: days,
    };
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  updateAssignment(empID: string, asgmt: number, field: string, value: any,
    schedID?: number): Observable<EmployeeResponse>  {
      const url = '/scheduler/api/v2/employee/assignment';
      const data: ChangeAssignmentRequest = {
        employee: empID,
        asgmt: asgmt,
        field: field,
        value: value,
      };
      if (schedID) {
        data.schedule = schedID;
      }
      return this.httpClient.put<EmployeeResponse>(url, data);
  }

  updateAssignmentSchedule(data: ChangeAssignmentRequest): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/assignment';
    return this.httpClient.put<EmployeeResponse>(url, data);
  }

  updateAssignmentWorkday(data: ChangeAssignmentRequest): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/assignment/workday';
    return this.httpClient.put<EmployeeResponse>(url, data);
  }

  deleteAssignment(empID: string, asgmtID: number):
    Observable<EmployeeResponse> {
    const url = `/scheduler/api/v2/employee/assignment/${empID}/${asgmtID}`;
    return this.httpClient.delete<EmployeeResponse>(url);
  }

  addLaborCode(empID: string, asgmt: number, chgNo: string, ext: string):
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/laborcode';
    const data: EmployeeLaborCodeRequest = {
      employee: empID,
      assignment: asgmt,
      chargeNumber: chgNo,
      extension: ext,
    };
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  removeLaborCode(empID: string, asgmt: number, chgNo: string, ext: string):
    Observable<EmployeeResponse> {
    const url = `/scheduler/api/v2/employee/laborcode/${empID}/${asgmt}/${chgNo}/${ext}`;
    return this.httpClient.delete<EmployeeResponse>(url);
  }

  addVariation(empID: string, vari: Variation): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/variation';
    const data: NewEmployeeVariation = {
      employee: empID,
      variation: vari,
    }
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  updateVariation(data: ChangeAssignmentRequest, isWorkday: boolean):
    Observable<EmployeeResponse> {
    let url = '/scheduler/api/v2/employee/variation';
    if (isWorkday) {
      url += '/workday';
    }
    return this.httpClient.put<EmployeeResponse>(url, data);
  }

  deleteVariation(empID: string, variationID: number): 
    Observable<EmployeeResponse> {
    const url = `/scheduler/api/v2/employee/variation/${empID}/${variationID}`;
    return this.httpClient.delete<EmployeeResponse>(url);
  }

  addLeave(empID: string, leave: LeaveDay): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/leaves';
    const data: EmployeeLeaveDayRequest = {
      employee: empID,
      leave: leave,
    };
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  updateLeave(empID: string, id: number, field: string, value: string): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/leaves';
    const data: UpdateRequest = {
      id: empID,
      optional: `${id}`,
      field: field,
      value: value,
    };
    return this.httpClient.put<EmployeeResponse>(url, data);
  }

  deleteLeave(empID: string, id: number): 
    Observable<EmployeeResponse> {
    const url = `/scheduler/api/v2/employee/leaves/${empID}/${id}`;
    return this.httpClient.delete<EmployeeResponse>(url);
  }

  createLeaveBalance(empID: string, year: number): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/balance';
    const data: LeaveBalanceRequest = {
      employee: empID,
      year: year,
      annual: 0.0,
      carryover: 0.0
    };
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  updateLeaveBalance(empID: string, year: number, field: string, value: string): 
    Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/balance';
    const data: UpdateRequest = {
      id: empID,
      optional: `${year}`,
      field: field,
      value: value
    };
    return this.httpClient.put<EmployeeResponse>(url, data);
  }

  createAllLeaveBalances(teamID: string, siteID: string, year: number): 
  Observable<SiteResponse> {
    const url = '/scheduler/api/v2/site/balances';
    const data: CreateSiteEmployeeLeaveBalances = {
      team: teamID,
      siteid: siteID,
      year: year
    };
    return this.httpClient.post<SiteResponse>(url, data);
  }

  updateEmployeeContact(empid: string, typeid: number, contact: number, 
    value: string): Observable<EmployeeResponse> {
    const url = '/scheduler/api/v2/employee/contact';
    const data: EmployeeContactUpdate = {
      employee: empid,
      typeid: typeid,
      contactid: contact,
      value: value,
    };
    return this.httpClient.post<EmployeeResponse>(url, data);
  }

  updateEmployeeSpecialty(empid: string, typeid: number, specialty: number, 
    value: boolean): Observable<EmployeeResponse> {
      const url = '/scheduler/api/v2/employee/specialty';
      const data: EmployeeSpecialtyUpdate = {
        employee: empid,
        typeid: typeid,
        specialtyid: specialty,
        value: value,
      };
      return this.httpClient.post<EmployeeResponse>(url, data);
  }

  updateEmployeeSpecialties(empid: string, action: string, 
    specialties: number[]): Observable<EmployeeResponse> {
      const url = '/scheduler/api/v2/employee/specialties';
      const data: EmployeeSpecialtiesUpdate = {
        employee: empid,
        action: action,
        specialties: specialties,
      };
      return this.httpClient.post<EmployeeResponse>(url, data);
  }
}
