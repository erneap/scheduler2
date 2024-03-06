import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { ISite, Site } from 'src/app/models/sites/site';
import { IShift, IWorkcenter, Shift, Workcenter } from 'src/app/models/sites/workcenter';
import { Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-workcenter-shift',
  templateUrl: './site-editor-workcenter-shift.component.html',
  styleUrls: ['./site-editor-workcenter-shift.component.scss']
})
export class SiteEditorWorkcenterShiftComponent {
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  @Input() team: Team = new Team();
  private _workcenter: Workcenter = new Workcenter();
  @Input()
  public set workcenter(wkctr: IWorkcenter) {
    this._workcenter = new Workcenter(wkctr);
  }
  get workcenter(): Workcenter {
    return this._workcenter;
  }
  private _shift: Shift = new Shift();
  @Input()
  public set shift(ipos: IShift) {
    this._shift = new Shift(ipos);
    this.setShift();
  }
  get shift(): Shift {
    return this._shift;
  }
  @Output() changed = new EventEmitter<Site>();
  shiftForm: FormGroup;
  showAdd: boolean = true;

  constructor(
    protected siteService: SiteService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { 
    const assign: string[] = [];
    this.shiftForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', Validators.required],
      associated: assign,
      paycode: 1,
      minimums: [0, [Validators.required]],
    });
  }

  setShift() {
    this.shiftForm.controls['id'].setValue(this.shift.id);
    this.shiftForm.controls['name'].setValue(this.shift.name);
    this.shiftForm.controls['associated'].setValue(this.shift.associatedCodes);
    this.shiftForm.controls['paycode'].setValue(this.shift.payCode);
    this.shiftForm.controls['minimums'].setValue(this.shift.minimums);
    this.showAdd = (this.shift.id === '' || this.shift.id === 'new');
  }

  updateShift(field: string) {
    let outputValue: string = '';
    const value = this.shiftForm.controls[field].value;
    if (field.toLowerCase() === 'associated') {
      let code = '';
      if (this.workcenter.shifts) {
        this.workcenter.shifts.forEach(s => {
          if (s.id.toLowerCase() === this.shift.id.toLowerCase()) {
            if (s.associatedCodes) {
              if (s.associatedCodes.length > value.length) {
                field = 'removecode';
                for (let i=0; i < s.associatedCodes.length && code === ''; i++) {
                  let found = false;
                  for (let j=0; j < value.length && !false; j++) {
                    if (s.associatedCodes[i] === value[j]) {
                      found = true;
                    }
                  }
                  if (!found) {
                    code = s.associatedCodes[i];
                  }
                }
              } else {
                field = 'addcode';
                for (let i=0; i < value.length && code === ''; i++) {
                  let found = false;
                  for (let j=0; j < s.associatedCodes.length && !found; j++) {
                    if (s.associatedCodes[j] === value[i]) {
                      found = true;
                    }
                  }
                  if (!found) {
                    code = value[i];
                  }
                }
              }
            } else if (value.length > 0) {
              code = value[0];
            } else {
              field = '';
            }
          }
        });
      }
      outputValue = code;
    } else {
      outputValue = `${value}`;
    }
    if (field !== '' && !(this.shift.id === 'new' || this.shift.id === '')) {
      this.dialogService.showSpinner();
      this.siteService.updateWorkcenterShift(this.team.id, this.site.id, 
      this.workcenter.id, this.shift.id, field, outputValue).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.site) {
            this.site = new Site(data.site);
            this.changed.emit(this.site);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }

  addShift() {
    if (this.shiftForm.controls['id'].valid 
      && this.shiftForm.controls['name'].valid) {
      const shiftID = this.shiftForm.value.id.toLowerCase();
      this.dialogService.showSpinner();
      this.siteService.addWorkcenterShift(this.team.id, this.site.id, 
      this.workcenter.id, shiftID, this.shiftForm.value.name)
      .subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.site) {
            this.site = new Site(data.site);
            this.changed.emit(this.site);
          }
        },
        error: (err: SiteResponse) => {
          this.dialogService.closeSpinner();
          this.authService.statusMessage = err.exception;
        }
      });
    }
  }
  
  deleteShift() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Workcenter Shift Deletion', 
      message: 'Are you sure you want to delete this Workcenter Shift?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.authService.statusMessage = "Deleting workcenter shift";
        this.dialogService.showSpinner();
        this.siteService.deleteWorkcenterShift(this.team.id, this.site.id, 
        this.workcenter.id, this.shift.id).subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.site) {
              this.site = new Site(data.site);
              this.changed.emit(this.site);
            }
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
