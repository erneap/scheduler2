import { Component } from '@angular/core';
import { QueryEmployeeSpecialtiesComponent } from './query-employee-specialties.component';

@Component({
  selector: 'app-query-employee-specialties-mobile',
  templateUrl: './query-employee-specialties.mobile.html',
  styleUrls: ['./query-employee-specialties.mobile.scss']
})
export class QueryEmployeeSpecialtiesMobile 
  extends QueryEmployeeSpecialtiesComponent {
  constructor() { super(); }
}
