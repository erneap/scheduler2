import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISite, Site } from 'src/app/models/sites/site';
import { IWorkcenter, Position, Shift, Workcenter } from 'src/app/models/sites/workcenter';
import { Team } from 'src/app/models/teams/team';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-workcenter',
  templateUrl: './site-editor-workcenter.component.html',
  styleUrls: ['./site-editor-workcenter.component.scss']
})
export class SiteEditorWorkcenterComponent {
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
    this.setWorkcenter();
  }
  get workcenter(): Workcenter {
    return this._workcenter;
  }
  @Output() changed = new EventEmitter<Site>();
  basicForm: FormGroup;
  positionForm: FormGroup;
  shiftForm: FormGroup;
  selectedPosition: Position = new Position();
  selectedShift: Shift = new Shift();
  showPosSortUp: boolean = true;
  showPosSortDown: boolean = true;
  showSftSortUp: boolean = true;
  showSftSortDown: boolean = true;

  constructor(
    protected siteService: SiteService,
    protected dialogService: DialogService,
    protected authService: AuthService,
    private fb: FormBuilder
  ) {
    this.basicForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
    this.positionForm = this.fb.group({
      position: '',
    });
    this.shiftForm = this.fb.group({
      shift: '',
    });
  }

  setWorkcenter() {
    this.basicForm.controls['id'].setValue(this.workcenter.id);
    this.basicForm.controls['name'].setValue(this.workcenter.name);
  }

  selectPosition() {
    this.selectedPosition = new Position();
    const posid = this.positionForm.value.position;
    this.showPosSortDown = true;
    this.showPosSortUp = true;
    if (posid !== '' && posid !== 'new') {
      let found = false;
      if (this.workcenter.positions) {
        for (let i=0; i < this.workcenter.positions.length && !found; i++) {
          if (this.workcenter.positions[i].id === posid) {
            this.selectedPosition = new Position(this.workcenter.positions[i]);
            this.showPosSortUp = !(i > 0);
            this.showPosSortDown = !(i < this.workcenter.positions.length -1);
          }
        }
      }
    } else {
      this.selectedPosition.id = 'new';
      this.showPosSortDown = true;
      this.showPosSortUp = true;
    }
  }

  selectShift() {
    this.selectedShift = new Shift();
    const posid = this.shiftForm.value.shift;
    this.showSftSortDown = true;
    this.showSftSortUp = true;
    if (posid !== '' && posid !== 'new') {
      let found = false;
      if (this.workcenter.shifts) {
        for (let i=0; i < this.workcenter.shifts.length && !found; i++) {
          if (this.workcenter.shifts[i].id === posid) {
            this.selectedShift = new Shift(this.workcenter.shifts[i]);
            this.showSftSortUp = !(i > 0);
            this.showSftSortDown = !(i < this.workcenter.shifts.length -1);
          }
        }
      }
    } else {
      this.selectedShift.id = 'new';
      this.showSftSortDown = true;
      this.showSftSortUp = true;
    }
  }

  onChangeSort(control: string, direction: string) {
    if (control.toLowerCase() === 'position') {

    } else {

    }
  }

  addNew() {

  }
}
