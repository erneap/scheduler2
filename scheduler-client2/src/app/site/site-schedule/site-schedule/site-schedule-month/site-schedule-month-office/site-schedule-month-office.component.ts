import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ISite, Site } from 'src/app/models/sites/site';
import { IWorkcenter, Workcenter } from 'src/app/models/sites/workcenter';
import { Workcode } from 'src/app/models/teams/workcode';
import { AppStateService } from 'src/app/services/app-state.service';

@Component({
  selector: 'app-site-schedule-month-office',
  templateUrl: './site-schedule-month-office.component.html',
  styleUrls: ['./site-schedule-month-office.component.scss']
})
export class SiteScheduleMonthOfficeComponent {
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  private _workcenter: Workcenter = new Workcenter();
  @Input()
  public set workcenter(iWc: IWorkcenter) {
    this._workcenter = new Workcenter(iWc);
  }
  get workcenter(): Workcenter {
    return this._workcenter;
  }
  private _month: Date = new Date();
  @Input()
  public set month(dt: Date) {
    this._month = new Date(dt);
    this.setMonth();
    this.setEmployees();
  }
  get month(): Date {
    return this._month;
  }
  @Input() workcodes: Workcode[] = [];
  
  monthDays: Date[] = [];
  count: number = -2;
  dayCount: number = -2;

  constructor(
    protected appState: AppStateService
  ) {}

  setMonth() {
    this.monthDays = [];
    let start = new Date(this.month.getFullYear(), this.month.getMonth(), 1);
    const end = new Date(this.month.getFullYear(), this.month.getMonth() + 1, 1);
    while (start.getTime() < end.getTime()) {
      this.monthDays.push(new Date(start));
      start = new Date(start.getTime() + (24 * 3600000));
    }
  }

  setEmployees() {
    if (this.site.employees) {
      this.site.employees.forEach(iEmp => {
        const emp = new Employee(iEmp);
        if (emp.isAssigned(this.site.id, this.workcenter.id, this.monthDays[0],
          this.monthDays[this.monthDays.length - 1])) {
            this.workcenter.addEmployee(emp, false, this.month);
          }
      });
    }
    this.count = -2;
    this.dayCount = -2;
  }

  nameWidth(): number {
    let width = (this.appState.viewWidth > 975) ? 975 
      : this.appState.viewWidth - 44; 
    const ratio = width / 975;
    width = Math.floor(250 * ratio)
    if (width < 150) {
      width = 150;
    }
    return width;
  }

  stdHeight(): number {
    let height = (this.appState.viewWidth > 975) ? 975 
      : this.appState.viewWidth - 44; 
    const ratio = height / 975;
    height = Math.floor(25 * ratio)
    if (height < 15) {
      height = 15;
    }
    return height;
  }

  nameStyle(): string {
    return `width: ${this.nameWidth()}px;`
  }

  nameCellStyle(): string {
    let width = (this.appState.viewWidth > 975) ? 975 
      : this.appState.viewWidth - 44; 
    const ratio = width / 975;
    let fontSize = Math.floor(12 * ratio);
    if (fontSize < 9) fontSize = 9;
    if (this.count < 0) {
      this.count++;
      return `background-color: black;color: white;font-size: ${fontSize}pt;`
        + `width: ${this.nameWidth()}px;height: ${this.stdHeight()}px;`;
    } else if (this.count % 2 === 0) {
      this.count++;
      return `background-color: #c0c0c0;color: black;font-size: ${fontSize}pt;`
        + `width: ${this.nameWidth()}px;height: ${this.stdHeight()}px;`;
    } else {
      this.count++;
      return `background-color: white;color: black;font-size: ${fontSize}pt;`
        + `width: ${this.nameWidth()}px;height: ${this.stdHeight()}px;`;
    }
  }

  increment(): number {
    return this.dayCount++;
  }

  daysStyle(): string {
    let width = (this.appState.viewWidth > 975) ? 975 
      : this.appState.viewWidth - 44; 
    width -= (this.nameWidth() + 2);
    return `width: ${width}px;`;
  }
}
