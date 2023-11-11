import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { TeamService } from 'src/app/services/team.service';
import { EmployeeSpecialtiesComponent } from './employee-specialties.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employee-specialties-desktop',
  templateUrl: './employee-specialties.desktop.html',
  styleUrls: ['./employee-specialties.desktop.scss']
})
export class EmployeeSpecialtiesDesktop extends EmployeeSpecialtiesComponent {
  constructor(
    protected ts: TeamService,
    protected es: EmployeeService,
    protected ds: DialogService,
    protected as: AuthService,
    private fb: FormBuilder
  ) { super(ts, es, ds, as, fb); }
}
