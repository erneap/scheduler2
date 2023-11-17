import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from 'src/app/models/employees/employee';
import { ISite, Site } from 'src/app/models/sites/site';

@Component({
  selector: 'app-site-employee',
  templateUrl: './site-employee.component.html',
  styleUrls: ['./site-employee.component.scss']
})
export class SiteEmployeeComponent {
  @Input() employee: Employee = new Employee();
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  @Output() changed = new EventEmitter<Employee>();

  getTabMaxHeight(): string {
    let height = window.innerHeight - 300;
    return `overflow: auto;max-height: ${height}px;`;
  }

  updateEmployee(emp: Employee) {
    this.changed.emit(emp);
  }

  setWidth(): string {
    let width = window.innerWidth - 320;
    return `width: ${width}px;`;
  }

  setMaxChildWidth(): number {
    return (window.innerWidth - 375);
  }
}
