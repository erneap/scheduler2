import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from 'src/app/models/employees/employee';

@Component({
  selector: 'app-site-employee',
  templateUrl: './site-employee.component.html',
  styleUrls: ['./site-employee.component.scss']
})
export class SiteEmployeeComponent {
  @Input() employee: Employee = new Employee();
  @Output() changed = new EventEmitter<Employee>();

  getTabMaxHeight(): string {
    let height = window.innerHeight - 300;
    return `overflow: auto;max-height: ${height}px;`;
  }

  updateEmployee(emp: Employee) {
    this.changed.emit(emp);
  }
}
