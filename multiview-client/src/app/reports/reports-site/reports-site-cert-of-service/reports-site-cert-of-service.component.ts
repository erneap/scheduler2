import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportRequest } from 'src/app/models/web/teamWeb';
import { DialogService } from 'src/app/services/dialog-service.service';
import { SiteService } from 'src/app/services/site.service';
import { TeamService } from 'src/app/services/team.service';

@Component({
  selector: 'app-reports-site-cert-of-service',
  templateUrl: './reports-site-cert-of-service.component.html',
  styleUrls: ['./reports-site-cert-of-service.component.scss']
})
export class ReportsSiteCertOfServiceComponent {
  @Input() reportType: string = '';
  reportForm: FormGroup;
  months: string[] = new Array("January", "February", 
    "March", "April", "May", "June", "July", "August", 
    "September", "October", "November", "December");

  constructor(
    protected teamService: TeamService,
    protected siteService: SiteService,
    protected dialogService: DialogService,
    protected httpClient: HttpClient,
    private fb: FormBuilder
  ){
    const now = new Date()
    this.reportForm = this.fb.group({
      year: [now.getFullYear(), [Validators.required]],
      month: [now.getMonth() + 1, [Validators.required]],
    });
  }

  onSubmit() {
    const url = '/scheduler/api/v2/reports';
    const iTeam = this.teamService.getTeam();
    const iSite = this.siteService.getSite();
    if (iTeam && iSite) {
      const period = `${this.reportForm.value.year}|`
        + `${this.reportForm.value.month}`;
      const request: ReportRequest = {
        reportType: this.reportType,
        period: period,
        teamid: iTeam.id,
        siteid: iSite.id,
      };
      this.dialogService.showSpinner();
      this.httpClient.post(url, request, { responseType: "blob", observe: 'response'})
        .subscribe(file => {
          if (file.body) {
            const blob = new Blob([file.body],
              {type: 'application/zip'});
              let contentDisposition = file.headers.get('Content-Disposition');
              let parts = contentDisposition?.split(' ');
              let fileName = '';
              parts?.forEach(pt => {
                if (pt.startsWith('filename')) {
                  let fParts = pt.split('=');
                  if (fParts.length > 1) {
                    fileName = fParts[1];
                  }
                }
              });
              if (!fileName) {
                fileName = 'cofs.zip';
              }
              const url = window.URL.createObjectURL(blob);
              
              const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
              a.href = url;
              a.download = fileName;
              document.body.appendChild(a);
              a.click();
    
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
              this.dialogService.closeSpinner();
          }
        });
    }
  }
}
