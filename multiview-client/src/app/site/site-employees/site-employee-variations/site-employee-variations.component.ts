import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { Variation } from 'src/app/models/employees/assignments';
import { Employee, IEmployee } from 'src/app/models/employees/employee';
import { ISite, Site } from 'src/app/models/sites/site';
import { EmployeeResponse } from 'src/app/models/web/employeeWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-site-employee-variations',
  templateUrl: './site-employee-variations.component.html',
  styleUrls: ['./site-employee-variations.component.scss']
})
export class SiteEmployeeVariationsComponent {
  private _employee: Employee = new Employee();
  @Input()
  public set employee(emp: IEmployee) {
    this._employee = new Employee(emp);
    this.setVariations();
  }
  get employee(): Employee {
    return this._employee;
  }
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  @Output() changed = new EventEmitter<Employee>();
  variations: Variation[] = [];
  variationForm: FormGroup;
  selectedVariation: Variation = new Variation();

  constructor(
    protected empService: EmployeeService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.variationForm = this.fb.group({
      variation: 0, 
    });
  }

  setVariations(): void {
    this.variations = [];
    this.employee.variations.forEach(v => {
      this.variations.push(new Variation(v));
    });
    this.variations.sort((a,b) => b.compareTo(a));
  }

  variationDates(asgmt: Variation): string {
    const months: string[] = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    return `${asgmt.startdate.getDate()} ${months[asgmt.startdate.getMonth()]}`
      + ` ${asgmt.startdate.getFullYear()} - ${asgmt.enddate.getDate()} `
      + `${months[asgmt.enddate.getMonth()]} ${asgmt.enddate.getFullYear()}`;
  }

  onSelect() {
    const variID = this.variationForm.value.variation;
    if (variID > 0) {
      this.variations.forEach(vari => {
        if (variID === vari.id) {
          this.selectedVariation = new Variation(vari);
        }
      });
    } else {
      this.selectedVariation = new Variation();
      this.selectedVariation.schedule.setScheduleDays(7);
      this.selectedVariation.schedule.showdates = false;
    }
  }

  updateEmployee(emp: Employee) {
    this.employee = emp;
    if (this.selectedVariation.id > 0) {
      const variID = this.selectedVariation.id;
      this.employee.variations.forEach(vari => {
        if (vari.id === variID) {
          this.selectedVariation = new Variation(vari);
        }
      })
    } else {
      let vari = new Variation();
      this.employee.variations.forEach(tv => {
        if (tv.id > vari.id) {
          vari = new Variation(tv);
        }
      });
      this.selectedVariation = vari;
    }
    this.changed.emit(emp);
  }

  deleteVariation() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Variation Deletion', 
      message: 'Are you sure you want to delete this variation?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.authService.statusMessage = "Deleting Employee Variation";
        this.empService.deleteVariation(this.employee.id, 
          this.selectedVariation.id)
          .subscribe({
            next: (data: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              if (data && data !== null) {
                if (data.employee) {
                  this.employee = new Employee(data.employee);
                  this.employee.variations.sort((a,b) => a.compareTo(b));
                  this.variationForm.controls["variation"].setValue(0);
                }
                const emp = this.empService.getEmployee();
                if (data.employee && emp && emp.id === data.employee.id) {
                  this.empService.setEmployee(data.employee);
                }
              }
              this.changed.emit(new Employee(this.employee));
              this.authService.statusMessage = "Deletion complete";
            },
            error: (err: EmployeeResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
      }
    })
  }
}
