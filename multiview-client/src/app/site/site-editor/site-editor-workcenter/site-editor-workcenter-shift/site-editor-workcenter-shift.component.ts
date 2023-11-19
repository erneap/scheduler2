import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISite, Site } from 'src/app/models/sites/site';
import { IShift, IWorkcenter, Shift, Workcenter } from 'src/app/models/sites/workcenter';
import { Team } from 'src/app/models/teams/team';
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
}
