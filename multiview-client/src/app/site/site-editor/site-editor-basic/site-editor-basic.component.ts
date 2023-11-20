import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ISite, Site } from 'src/app/models/sites/site';
import { Team } from 'src/app/models/teams/team';
import { SiteResponse } from 'src/app/models/web/siteWeb';
import { AuthService } from 'src/app/services/auth.service';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-site-editor-basic',
  templateUrl: './site-editor-basic.component.html',
  styleUrls: ['./site-editor-basic.component.scss']
})
export class SiteEditorBasicComponent {
  private _site: Site = new Site();
  @Input()
  public set site(isite: ISite) {
    this._site = new Site(isite);
    this.setSite();
  }
  get site(): Site {
    return this._site;
  }
  @Input() team: Team = new Team();
  @Output() changed = new EventEmitter<Site>();
  basicForm: FormGroup;

  constructor(
    protected siteService: SiteService,
    protected authService: AuthService,
    protected dialogService: DialogService,
    private fb: FormBuilder
  ) {
    this.basicForm = this.fb.group({
      name: ['', [Validators.required]],
      mids: false,
      offset: [0, [Validators.required, Validators.min(-12), Validators.max(12)]],
    });
  }

  setSite() {
    this.basicForm.controls['name'].setValue(this.site.name);
    this.basicForm.controls['mids'].setValue(this.site.showMids);
    this.basicForm.controls['offset'].setValue(this.site.utcOffset);
  }
  
  onChange() {
    if (this.basicForm.valid) {
      this.dialogService.showSpinner();
      this.siteService.UpdateSite(this.team.id, this.site.id, 
        this.basicForm.value.name, this.basicForm.value.mids,
        this.basicForm.value.offset).subscribe({
        next: (data: SiteResponse) => {
          this.dialogService.closeSpinner();
          if (data && data != null && data.site) {
            this.site = new Site(data.site);
            this.changed.emit(new Site(data.site));
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
