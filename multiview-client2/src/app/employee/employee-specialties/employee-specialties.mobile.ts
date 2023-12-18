import { Component } from '@angular/core';
import { EmployeeSpecialtiesComponent } from './employee-specialties.component';
import { TeamService } from 'src/app/services/team.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employee-specialties-mobile',
  templateUrl: './employee-specialties.mobile.html',
  styleUrls: ['./employee-specialties.mobile.scss']
})
export class EmployeeSpecialtiesMobile extends EmployeeSpecialtiesComponent {
  constructor(
    protected ts: TeamService,
    protected es: EmployeeService,
    protected ds: DialogService,
    protected as: AuthService,
    private fb: FormBuilder
    ) { super(ts, es, ds, as, fb); }
}
