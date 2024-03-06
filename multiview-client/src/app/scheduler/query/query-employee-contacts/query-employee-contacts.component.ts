import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ContactType } from 'src/app/models/teams/contacttype';

@Component({
  selector: 'app-query-employee-contacts',
  templateUrl: './query-employee-contacts.component.html',
  styleUrls: ['./query-employee-contacts.component.scss']
})
export class QueryEmployeeContactsComponent {
  private _employee: Employee = new Employee();
  @Input()
  public set employee(iEmp: IEmployee) {
    this._employee = new Employee(iEmp);
  }
  get employee(): Employee {
    return this._employee;
  }

  private _contacttypes: ContactType[] = [];
  @Input()
  public set contacttypes(cts: ContactType[]) {
    this._contacttypes = [];
    cts.forEach(ct => {
      this._contacttypes.push(new ContactType(ct));
    });
  }
  get contacttypes(): ContactType[] {
    return this._contacttypes;
  }

  constructor() {}

  contactValue(ctid: number): string {
    let answer = '';
    this.employee.contactinfo.forEach(ci => {
      if (ci.typeid === ctid) {
        answer = ci.value;
      }
    });
    return answer;
  }
}
