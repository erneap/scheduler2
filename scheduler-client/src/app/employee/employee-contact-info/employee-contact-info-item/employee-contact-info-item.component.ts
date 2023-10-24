import { Component, Input } from '@angular/core';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ContactType } from 'src/app/models/teams/contacttype';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-contact-info-item',
  templateUrl: './employee-contact-info-item.component.html',
  styleUrls: ['./employee-contact-info-item.component.scss']
})
export class EmployeeContactInfoItemComponent {
  private _contactType: ContactType = new ContactType();
  @Input()
  public set contacttype(ct: ContactType) {
    this._contactType = new ContactType(ct);
  }
  get contacttype(): ContactType {
    return this._contactType;
  }
  private _employee: Employee = new Employee();
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
  }
  get employee(): Employee {
    return this._employee;
  }
  contact: string = '';
  contactid: number = 0;

  constructor(
    protected empService: EmployeeService,
    protected dialogService: DialogService,
    protected authService: AuthService
  ) {

  }

  setContactType() {
    this.contact = '';
    this.employee.contactinfo.forEach(c => {
      if (c.typeid === this.contacttype.id) {
        this.contactid = c.id;
        this.contact = c.value;
      }
    });
  }

  updateContactType() {
    
  }
}
