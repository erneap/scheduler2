import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DeletionConfirmationComponent } from 'src/app/generic/deletion-confirmation/deletion-confirmation.component';
import { Work } from 'src/app/models/employees/work';
import { ISite, Site } from 'src/app/models/sites/site';
import { Workcenter } from 'src/app/models/sites/workcenter';
import { Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-workcenters',
  templateUrl: './site-editor-workcenters.component.html',
  styleUrls: ['./site-editor-workcenters.component.scss']
})
export class SiteEditorWorkcentersComponent {
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
  }
  get site(): Site {
    return this._site;
  }
  @Input() team: Team = new Team();
  @Output() changed = new EventEmitter<Site>();
  selectedWorkcenter: Workcenter = new Workcenter()
  wkctrForm: FormGroup;
  showSortUp: boolean = true;
  showSortDown: boolean = true;

  constructor(
    protected siteService: SiteService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { 
    this.wkctrForm = this.fb.group({
      workcenter: 'new',
    })
  }

  onSelect() {
    const wkctrID = this.wkctrForm.value.workcenter;
    if (wkctrID !== '' && wkctrID !== 'new') {
      this.showSortDown = true;
      this.showSortUp = true;
      let found = false;
      for (let i=0; i < this.site.workcenters.length && !found; i++) {
        if (this.site.workcenters[i].id === wkctrID) {
          this.selectedWorkcenter = new Workcenter(this.site.workcenters[i]);
          this.showSortUp = !(i > 0);
          this.showSortDown = !(i < this.site.workcenters.length -1 );
          found = true;
        }
      }
    } else {
      this.selectedWorkcenter = new Workcenter();
      this.showSortDown = true;
      this.showSortUp = true;
    }
  }

  updateSite(site: Site) {
    this.site = site;
    if (this.selectedWorkcenter.id === 'new') {
      this.site.workcenters.sort((a,b) => a.compareTo(b));
      this.selectedWorkcenter = new Workcenter(
        this.site.workcenters[this.site.workcenters.length - 1]);
    } else {
      const wkid = this.selectedWorkcenter.id;
      this.site.workcenters.forEach(wk => {
        if (wk.id === wk.id) {
          this.selectedWorkcenter = new Workcenter(wk);
        }
      });
    }
    this.changed.emit(site);
  }
  
  onDeleteWorkcenter() {
    const dialogRef = this.dialog.open(DeletionConfirmationComponent, {
      data: {title: 'Confirm Workcenter Deletion', 
      message: 'Are you sure you want to delete this Workcenter?'},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.dialogService.showSpinner();
        this.siteService.deleteWorkcenter(this.team.id, this.site.id, 
          this.selectedWorkcenter.id).subscribe({
          next: (data: SiteResponse) => {
            this.dialogService.closeSpinner();
            if (data && data != null && data.site) {
              this.site = new Site(data.site);
              this.selectedWorkcenter = new Workcenter();
              this.wkctrForm.controls['workcenter'].setValue('new');
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

  onChangeSort(direction: string) {
    this.dialogService.showSpinner();
    this.siteService.updateWorkcenter(this.team.id, this.site.id, 
      this.selectedWorkcenter.id, 'move', direction).subscribe({
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
