import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee } from '../../models/employees/employee';
import { QueryService } from '../../services/query.service';
import { TeamService } from '../../services/team.service';
import { IngestResponse } from '../../models/web/siteWeb';
import { DialogService } from '../../services/dialog-service.service';
import { ContactType, SpecialtyType } from '../../models/teams/contacttype';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss']
})
export class QueryComponent {
  queryForm: FormGroup;
  employeeForm: FormGroup;
  listedEmployees: Employee[];
  employee: Employee;
  specialties: SpecialtyType[];
  contactTypes: ContactType[];
  teamid: string = '';

  constructor(
    protected teamService: TeamService,
    protected queryService: QueryService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    protected builder: FormBuilder
  ) {
    this.queryForm = this.builder.group({
      hours: 0,
      specialties: [],
    });
    this.employeeForm = this.builder.group({
      employee: '',
    });
    this.listedEmployees = [];
    this.specialties = [];
    this.contactTypes = [];
    this.employee = new Employee();

    // initial list of employees working right now
    const team = this.teamService.getTeam();
    if (team) {
      this.teamid = team.id;
      this.dialogService.showSpinner();
      team.specialties.forEach(sp => {
        this.specialties.push(new SpecialtyType(sp));
      });
      this.specialties.sort((a,b) => a.compareTo(b));
      team.contacttypes.forEach(ct => {
        this.contactTypes.push(new ContactType(ct));
      });
      this.contactTypes.sort((a,b) => a.compareTo(b));
      this.queryService.getBasic(team.id).subscribe({
        next: (resp: IngestResponse) => {
          this.dialogService.closeSpinner();
          resp.employees.forEach(emp => {
            this.listedEmployees.push(new Employee(emp));
          });
          this.listedEmployees.sort((a,b) => a.compareTo(b));
        },
        error: (err: IngestResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = `Query Error: ${err.exception}`;
        }
      });
    }
  }

  completeQuery() {
    this.listedEmployees = [];
    const hours = Number(this.queryForm.value.hours);
    const specialties: number[] = this.queryForm.value.specialties;
    this.dialogService.showSpinner();
    this.queryService.getQuery(this.teamid, hours, specialties).subscribe({
      next: (resp: IngestResponse) => {
        this.dialogService.closeSpinner();
        resp.employees.forEach(emp => {
          this.listedEmployees.push(new Employee(emp));
        });
        this.listedEmployees.sort((a,b) => a.compareTo(b));
      },
      error: (err: IngestResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = `Query Error: ${err.exception}`;
      }
    });
  }

  findEmployee() {
    this.employee = new Employee();
    const empID = this.employeeForm.value.employee;
    this.listedEmployees.forEach(emp => {
      if (emp.id === empID) {
        this.employee = new Employee(emp);
      }
    });
  }
}
