import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISite, Site } from 'src/app/models/sites/site';
import { IPosition, IWorkcenter, Position, Workcenter } from 'src/app/models/sites/workcenter';
import { Team } from 'src/app/models/teams/team';
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

  }

  addPosition() {

  }
}
