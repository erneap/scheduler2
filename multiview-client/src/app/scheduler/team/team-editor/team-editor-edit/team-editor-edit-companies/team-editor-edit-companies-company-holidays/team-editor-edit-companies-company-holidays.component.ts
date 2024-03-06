import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Company, CompanyHoliday, ICompany } from 'src/app/models/teams/company';
import { ITeam, Team } from 'src/app/models/teams/team';
import { TeamCompanyUpdate } from '../team-editor-edit-companies.component';
import { TeamService } from 'src/app/services/team.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';

@Component({
  selector: 'app-team-editor-edit-companies-company-holidays',
  templateUrl: './team-editor-edit-companies-company-holidays.component.html',
  styleUrls: ['./team-editor-edit-companies-company-holidays.component.scss'],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true}},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ]
})
export class TeamEditorEditCompaniesCompanyHolidaysComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
  }
  get team(): Team {
    return this._team;
  }
  private _company: Company = new Company()
  @Input()
  public set company(co: ICompany) {
    this._company = new Company(co);
    this.onSelectHoliday();
  }
  get company(): Company {
    return this._company;
  }
  @Output() changed = new EventEmitter<TeamCompanyUpdate>();
  selectedHoliday: CompanyHoliday = new CompanyHoliday();
  selectedActualDate: Date = new Date(0);
  holidaysForm: FormGroup;
  holidayForm: FormGroup;
  disableHolidayUp: boolean = true;
  disableHolidayDown: boolean = true;
  disableActualDelete: boolean = true;
  months: string[] = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 
      'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.holidaysForm = this.fb.group({
      holiday: '',
    });
    this.holidayForm = this.fb.group({
      id: 'H',
      name: ['', [Validators.required]],
      actual: '',
      actualdate: new Date(),
    });
  }

  holidayID(hol: CompanyHoliday): string {
    return `${hol.id}${hol.sort}`;
  }

  onSelectHoliday() {
    const holID = String(this.holidaysForm.value.holiday);
    let maxH = 0;
    let maxF = 0;
    this.company.holidays.forEach(hol => {
      if (hol.id.toLowerCase() === 'h' && maxH < hol.sort) {
        maxH = hol.sort;
      } else if (hol.id.toLowerCase() === 'f' && maxF < hol.sort) {
        maxF = hol.sort;
      }
    });
    if (holID.length > 1) {
      this.selectedHoliday = new CompanyHoliday();
      this.company.holidays.forEach(hol => {
        if (holID === this.holidayID(hol)) {
          this.selectedHoliday = new CompanyHoliday(hol);
        }
      });
      this.disableHolidayUp = (this.selectedHoliday.sort === 1);
      if (this.selectedHoliday.id.toLowerCase() === 'h') {
        this.disableHolidayDown = (maxH === this.selectedHoliday.sort);
      } else {
        this.disableHolidayDown = (maxF === this.selectedHoliday.sort);
      }
    } else {
      this.selectedHoliday = new CompanyHoliday();
      this.disableHolidayDown = true;
      this.disableHolidayUp = true;
    }
    this.holidayForm.controls['name'].setValue(this.selectedHoliday.name);
  }

  actualLabel(date: Date): string {
    return `${date.getDate()} ${this.months[date.getMonth()]} `
      + `${date.getFullYear()}`;
  }

  onSelectActual() {
    const actualID = this.holidayForm.value.actual;
    this.disableActualDelete = true;
    if (actualID === '') {
      this.selectedActualDate = new Date(0);
      this.holidayForm.controls['actualdate'].setValue(new Date())
    } else {
      this.selectedHoliday.actualdates.forEach(dt => {
        if (actualID === this.actualLabel(dt)) {
          this.disableActualDelete = false;
          this.selectedActualDate = new Date(dt);
          this.holidayForm.controls['actualdate'].setValue(new Date(dt));
        }
      });
    }
  }

  getDate(dt: Date): string {
    let answer = `${dt.getFullYear()}-`;
    if (dt.getMonth() < 9) {
      answer += '0';
    }
    answer += `${dt.getMonth() + 1}-`;
    if (dt.getDate() < 10) {
      answer += '0';
    }
    answer += `${dt.getDate()}`;
    return answer;
  }

  updateActualDate() {
    let field = 'addactual';
    const newDate = new Date(this.holidayForm.value.actualdate);
    let value = this.getDate(newDate);
    if (this.selectedActualDate.getTime() > 0) {
      field = 'replaceactual';
      value = this.getDate(this.selectedActualDate) + "|" + value;
    }
    this.dialogService.showSpinner();
    this.teamService.updateTeamCompanyHoliday(this.team.id, this.company.id,
    this.holidayID(this.selectedHoliday), field, value).subscribe({
      next: (data: SiteResponse) => {
        this.dialogService.closeSpinner();
        if (data && data != null && data.team) {
          this.team = data.team;
          this.team.companies.forEach(co => {
            if (co.id === this.company.id) {
              this.company = new Company(co);
            }
          })
          const update: TeamCompanyUpdate = {
            team: new Team(this.team),
            company: new Company(this.company)
          }
          this.holidayForm.controls['actual'].setValue(this.actualLabel(newDate));
          this.onSelectActual();
          this.changed.emit(update);
        }
      },
      error: (err: SiteResponse) => {
        this.dialogService.closeSpinner();
        this.authService.statusMessage = err.exception;
      }
    });
  }

  deleteActualDate() {
    let field = 'removeactual';
    let value = this.getDate(this.selectedActualDate);
    if (this.selectedActualDate.getTime() > 0) {
      this.dialogService.showSpinner();
      this.teamService.updateTeamCompanyHoliday(this.team.id, this.company.id,
      this.holidayID(this.selectedHoliday), field, value).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.team) {
            this.team = data.team;
            this.team.companies.forEach(co => {
              if (co.id === this.company.id) {
                this.company = new Company(co);
              }
            })
            const update: TeamCompanyUpdate = {
              team: new Team(this.team),
              company: new Company(this.company)
            }
            this.selectedActualDate = new Date();
            this.holidayForm.controls['actual'].setValue('');
            this.onSelectActual();
            this.changed.emit(update);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  onAddHoliday() {
    if (this.selectedHoliday.id === '' && this.holidayForm.valid) {
      const holType = this.holidayForm.value.id;
      const name = this.holidayForm.value.name;
      this.teamService.addTeamCompanyHoliday(this.team.id, this.company.id, 
        holType, name, '')
        .subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.team) {
              this.team = data.team;
              const update: TeamCompanyUpdate = {
                team: new Team(this.team),
                company: new Company()
              }
              this.team.companies.forEach(co => {
                if (co.id === this.company.id) {
                  this.company = co;
                  update.company = new Company(co);
                  co.holidays.forEach(hol => {
                    if (hol.name === name) {
                      this.selectedHoliday = new CompanyHoliday(hol);
                      this.holidaysForm.controls['holiday']
                        .setValue(this.holidayID(this.selectedHoliday));
                      this.onSelectHoliday();
                    }
                  });
                }
              });
              this.changed.emit(update);
            }
          },
          error: (err: SiteResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        })
    }
  }

  onUpdateHoliday(field: string) {
    if (this.selectedHoliday.id !== '') {
      const value = this.holidayForm.controls[field].value;
      this.dialogService.showSpinner();
      this.teamService.updateTeamCompanyHoliday(this.team.id, this.company.id,
      this.holidayID(this.selectedHoliday), field, value).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.team) {
            this.team = data.team;
            this.team.companies.forEach(co => {
              if (co.id === this.company.id) {
                this.company = new Company(co);
              }
            })
            const update: TeamCompanyUpdate = {
              team: new Team(this.team),
              company: new Company(this.company)
            }
            this.changed.emit(update);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  deleteHoliday() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Company Holiday Deletion', 
      message: 'Are you sure you want to delete this Company Holiday?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.authService.statusMessage = "Delete team company holiday";
        this.dialogService.showSpinner();
        this.teamService.deleteTeamCompanyHoliday(this.team.id, this.company.id, 
          this.holidayID(this.selectedHoliday)).subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.team) {
              this.team = data.team;
              const update: TeamCompanyUpdate = {
                team: this.team,
                company: new Company()
              }
              this.team.companies.forEach(co => {
                if (co.id === this.company.id) {
                  this.company = new Company(co);
                  update.company = new Company(co);
                }
              });
              this.selectedHoliday = new CompanyHoliday();
              this.holidaysForm.controls['holiday'].setValue('');
              this.onSelectHoliday();
            }
          },
          error: (err: SiteResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        })
      }
    });
  }
  
  onChangeSort(direction: string) {
    if (this.selectedHoliday.id !== '') {
      if ((direction.substring(0,1).toLowerCase() === 'u' 
        && !this.disableHolidayUp)
        || (direction.substring(0,1).toLowerCase() === 'd' 
        && !this.disableHolidayDown)) { 
        const name = this.selectedHoliday.name;
        this.dialogService.showSpinner();
        this.teamService.updateTeamCompanyHoliday(this.team.id, this.company.id,
        this.holidayID(this.selectedHoliday), 'move', direction).subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.team) {
              this.team = data.team;
              const update: TeamCompanyUpdate = {
                team: this.team,
                company: new Company()
              }
              this.team.companies.forEach(co => {
                if (co.id === this.company.id) {
                  this.company = new Company(co);
                  update.company = new Company(co);
                  co.holidays.forEach(hol => {
                    if (hol.name === name) {
                      this.selectedHoliday = new CompanyHoliday(hol);
                      this.holidaysForm.controls['holiday'].setValue(
                        this.holidayID(this.selectedHoliday));
                      this.onSelectHoliday();
                    }
                  })
                }
              });
              this.changed.emit(update);
            }
          },
          error: (err: SiteResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    }
  }
}
