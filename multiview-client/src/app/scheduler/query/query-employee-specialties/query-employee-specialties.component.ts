import { Component, Input } from '@angular/core';
import { Employee } from 'src/app/models/employees/employee';
import { SpecialtyType } from 'src/app/models/teams/contacttype';

@Component({
  selector: 'app-query-employee-specialties',
  templateUrl: './query-employee-specialties.component.html',
  styleUrls: ['./query-employee-specialties.component.scss']
})
export class QueryEmployeeSpecialtiesComponent {
 @Input() employee: Employee = new Employee();
 @Input() specialtytypes: SpecialtyType[] = [];

 constructor() { }

 hasSpecialty(id: number): boolean {
  let answer = false;
  this.employee.specialties.forEach(s => {
    if (s.specialtyid === id) {
      answer = true;
    }
  });
  return answer;
 }
}
