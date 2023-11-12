import { Component } from '@angular/core';
import { QueryEmployeeContactsComponent } from './query-employee-contacts.component';

@Component({
  selector: 'app-query-employee-contacts-mobile',
  templateUrl: './query-employee-contacts.mobile.html',
  styleUrls: ['./query-employee-contacts.mobile.scss']
})
export class QueryEmployeeContactsMobile extends QueryEmployeeContactsComponent {
  constructor() { super(); }
}
