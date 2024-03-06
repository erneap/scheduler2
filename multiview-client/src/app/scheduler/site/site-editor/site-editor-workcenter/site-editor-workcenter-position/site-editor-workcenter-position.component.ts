import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { ISite, Site } from 'src/app/models/sites/site';
import { IPosition, IWorkcenter, Position, Workcenter } from 'src/app/models/sites/workcenter';
import { Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-workcenter-position',
  templateUrl: './site-editor-workcenter-position.component.html',
  styleUrls: ['./site-editor-workcenter-position.component.scss']
})
export class SiteEditorWorkcenterPositionComponent {
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
  private _position: Position = new Position();
  @Input()
  public set position(ipos: IPosition) {
    this._position = new Position(ipos);
    this.setPosition();
  }
  get position(): Position {
    return this._position;
  }
  @Output() changed = new EventEmitter<Site>();
  positionForm: FormGroup;
  showAdd: boolean = true;

  constructor(
    protected siteService: SiteService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { 
    const assign: string[] = [];
    this.positionForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', Validators.required],
      assigned: assign,
    });
  }

  setPosition() {
    this.positionForm.controls['id'].setValue(this.position.id);
    this.positionForm.controls['name'].setValue(this.position.name);
    this.positionForm.controls['assigned'].setValue(this.position.assigned);
    this.showAdd = (this.position.id === '' || this.position.id === 'new');
  }

  updatePosition(field: string) {
    let outputValue = '';
    const value = this.positionForm.controls[field].value;
    let id: string = ''
    if (field.toLowerCase() === 'assigned') {
      let code = '';
      if (this.workcenter.positions) {
        this.workcenter.positions.forEach(s => {
          if (s.id.toLowerCase() === this.position.id.toLowerCase()) {
            if (s.assigned) {
              if (s.assigned.length > value.length) {
                field = 'removeassigned';
                for (let i=0; i < s.assigned.length && code === ''; i++) {
                  let found = false;
                  for (let j=0; j < value.length && !false; j++) {
                    if (s.assigned[i] === value[j]) {
                      found = true;
                    }
                  }
                  if (!found) {
                    code = s.assigned[i];
                  }
                }
              } else {
                field = 'addassigned';
                for (let i=0; i < value.length && code === ''; i++) {
                  let found = false;
                  for (let j=0; j < s.assigned.length && !found; j++) {
                    if (s.assigned[j] === value[i]) {
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
        outputValue = code;
      } else {
        outputValue = `${value}`;
      }
    }
    if (field !== '' && !(this.position.id === 'new' || this.position.id === '')) {
      this.dialogService.showSpinner();
      this.siteService.updateWorkcenterPosition(this.team.id, this.site.id, 
      this.workcenter.id, this.position.id, field, outputValue).subscribe({
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

  addPosition() {
    if (this.positionForm.controls['id'].valid 
    && this.positionForm.controls['name'].valid) {
      const id = this.positionForm.value.id;
      const name = this.positionForm.value.name;
      this.dialogService.showSpinner();
      this.siteService.addWorkcenterPosition(this.team.id, this.site.id, 
      this.workcenter.id, id, name).subscribe({
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

  deletePosition() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Workcenter Position Deletion', 
      message: 'Are you sure you want to delete this Workcenter Position?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.siteService.deleteWorkcenterPosition(this.team.id, this.site.id,
          this.workcenter.id, this.position.id).subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.site) {
              this.site = new Site(data.site);
              this.changed.emit(this.site);
            }
            this.authService.statusMessage = "Deletion completed"
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
