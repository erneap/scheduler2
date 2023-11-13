import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Employee } from 'src/app/models/employees/employee';
import { EmployeeService } from 'src/app/services/employee.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-employees',
  templateUrl: './site-employees.component.html',
  styleUrls: ['./site-employees.component.scss']
})
export class SiteEmployeesComponent {
  employeeSelectionForm: FormGroup;
  selectedEmployee: Employee = new Employee();
  siteEmployees: Employee[] = [];
  activeOnly: boolean = true;

  constructor(
    protected empService: EmployeeService,
    protected siteService: SiteService,
    private fb: FormBuilder
  ) {
    const emp = this.empService.getEmployee();
    let empID = '';
    if (emp) {
      empID = emp.id;
    }
    this.employeeSelectionForm = this.fb.group({
      employee: empID,
      activeOnly: true,
    });
    this.setEmployees();
    this.selectEmployee();
  }

  setEmployees(): void {
    const site = this.siteService.getSite();
    this.siteEmployees = [];
    const active = this.employeeSelectionForm.value.activeOnly;
    if (site && site.employees) {
      site.employees.forEach(iEmp => {
        const emp = new Employee(iEmp);
        if ((active && emp.isActive()) || !active) {
          this.siteEmployees.push(emp);
        }
      });
      this.siteEmployees.sort((a,b) => a.compareTo(b));
    }
  }

  selectEmployee(): void {
    const empID: string = this.employeeSelectionForm.value.employee;
    if (empID === 'new') {
      this.selectedEmployee = new Employee();
      this.selectedEmployee.id = 'new';
    } else {
      const site = this.siteService.getSite();
      if (site && site.employees) {
        site.employees.forEach(emp => {
          if (empID.toLowerCase() === emp.id.toLowerCase()) {
            this.selectedEmployee = new Employee(emp);
          }
        });
      }
    }
  }

  updateEmployee(emp: Employee) {
    const employee = this.empService.getEmployee();
    const site = this.siteService.getSite();
    if (employee && employee.id === emp.id) {
      this.empService.setEmployee(emp);
    }
    if (site && site.employees) {
      let found = false;
      for (let i=0; i < site.employees.length && !found; i++) {
        if (site.employees[i].id === emp.id) {
          site.employees[i] = new Employee(emp);
          found = true;
        }
      }
      this.siteService.setSite(site);
    }
    this.setEmployees();
  }

  optionClass(id: string): string {
    let answer = '';
    const now = new Date();
    this.siteEmployees.forEach(emp => {
      if (emp.id === id) {
        if (emp.user && emp.user.passwordExpires.getTime() < now.getTime()) {
          answer = 'expired';
        } else if (emp.user && emp.user.badAttempts > 2) {
          answer = 'locked';
        }
      }
    });
    return answer;
  }
}
