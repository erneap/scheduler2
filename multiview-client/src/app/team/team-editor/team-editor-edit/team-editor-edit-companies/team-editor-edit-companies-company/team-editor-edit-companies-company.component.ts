import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeam, Team } from 'src/app/models/teams/team';
import { TeamCompanyUpdate } from '../team-editor-edit-companies.component';
import { Company, ICompany } from 'src/app/models/teams/company';
import { TeamService } from 'src/app/services/team.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DuplicateValidator } from 'src/app/models/validators/duplicate-validator.directive';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';

@Component({
  selector: 'app-team-editor-edit-companies-company',
  templateUrl: './team-editor-edit-companies-company.component.html',
  styleUrls: ['./team-editor-edit-companies-company.component.scss']
})
export class TeamEditorEditCompaniesCompanyComponent {
  private _team: Team = new Team()
  @Input()
  public set team(team: ITeam) {
    this._team = new Team(team);
    this.setCompanies();
  }
  get team(): Team {
    return this._team;
  }
  private _company: Company = new Company()
  @Input()
  public set company(co: ICompany) {
    this._company = new Company(co);
    this.setCompany()
  }
  get company(): Company {
    return this._company;
  }
  @Output() changed = new EventEmitter<TeamCompanyUpdate>();
  companyForm: FormGroup;
  weekdays: string[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
    "Friday", "Saturday"];
  showStart: boolean = false;
  hasHolidays: boolean = false;

  constructor(
    protected teamService: TeamService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      id: ['', [Validators.required, new DuplicateValidator]],
      name: ['', [Validators.required]],
      ingest: ['manual', [Validators.required]],
      period: "7",
      start: "6",
      holidays: false,
      comparearray: '',
    });
  }

  updateTeam(update: TeamCompanyUpdate) {
    this.team = new Team(update.team);
    this.company = new Company(update.company);
  }

  setCompanies() {
    let codes = '';
    this.team.companies.forEach(co => {
      if (codes !== '') {
        codes += ',';
      }
      codes += co.id;
    });
    this.companyForm.controls['comparearray'].setValue(codes);
  }

  setCompany() {
    this.companyForm.controls['id'].setValue(this.company.id);
    this.companyForm.controls['name'].setValue(this.company.name);
    this.companyForm.controls['ingest'].setValue(this.company.ingest);
    if (this.company.ingestPeriod) {
      this.companyForm.controls['period'].setValue(`${this.company.ingestPeriod}`);
      let period = Number(this.company.ingestPeriod);
      this.showStart = (this.company.ingest !== 'manual' && period < 15);
    } else {
      this.showStart = false;
      this.companyForm.controls['period'].setValue('30');
    }
    if (this.company.startDay) {
      this.companyForm.controls["start"].setValue(this.company.startDay);
    } else {
      this.companyForm.controls["start"].setValue(0);
    }
    this.hasHolidays = this.company.holidays.length > 0;
    this.companyForm.controls['holidays'].setValue(this.hasHolidays);
  }

  onChange(field: string) {
    if (field === 'period') {
      const nPeriod = Number(this.companyForm.controls[field].value);
      this.showStart = nPeriod < 15;
    }
    if (this.company.id !== '' && this.companyForm.controls[field].valid) {
      const value = this.companyForm.controls[field].value;
      if (field !== 'holidays') {
        this.dialogService.showSpinner();
        this.teamService.updateTeamCompany(this.team.id, this.company.id, field,
          value).subscribe({
            next: (data: SiteResponse) => {
              this.dialogService.closeSpinner();
              if (data && data != null && data.team) {
                this.team = data.team;
                const update: TeamCompanyUpdate = {
                  team: this.team,
                  company: new Company()
                }
                this.changed.emit(update);
              }
            },
            error: (err: SiteResponse) => {
              this.dialogService.closeSpinner();
              this.authService.statusMessage = err.exception;
            }
          });
      } else {
        this.hasHolidays = value;
      }
    }
  }

  onAdd() {
    if (this.companyForm.valid) {
      this.authService.statusMessage = "Adding new company";
      this.dialogService.showSpinner();
      const id = this.companyForm.value.id;
      this.teamService.addTeamCompany(this.team.id, id, 
        this.companyForm.value.name, this.companyForm.value.ingest).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.team) {
            this.team = new Team(data.team);
            this.team.companies.forEach(co => {
              if (id === co.id) {
                const update: TeamCompanyUpdate = {
                  team: this.team,
                  company: new Company(co)
                }
                this.changed.emit(update);
              }
            });
          }
          this.authService.statusMessage = "Addition complete";
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  onDelete() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Company Deletion', 
      message: 'Are you sure you want to delete this Company?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.authService.statusMessage = "Delete team company";
        this.dialogService.showSpinner();
        this.teamService.deleteTeamCompany(this.team.id, this.company.id)
        .subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.team) {
              this.team = new Team(data.team);
              const update: TeamCompanyUpdate = {
                team: this.team,
                company: new Company()
              }
              update.company.id = 'delete'
            }
            this.authService.statusMessage = "Deletion complete"
          },
          error: (err: SiteResponse) => {
            this.dialogService.closeSpinner();
            this.authService.statusMessage = err.exception;
          }
        });
      }
    });
  }
}
