import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IngestChange, IngestResponse, ManualIngestChanges } from '../models/web/siteWeb';

@Injectable({
  providedIn: 'root'
})
export class SiteIngestService {
  constructor(
    protected httpClient: HttpClient
  ) 
  {}

  getIngestEmployees(team: string, site: string, company: string): 
    Observable<IngestResponse> {
    const url = `/scheduler/api/v2/ingest/${team}/${site}/${company}`;
    return this.httpClient.get<IngestResponse>(url);
  }

  fileIngest(formdata: FormData): Observable<IngestResponse> {
    const url = '/scheduler/api/v2/ingest/';
    return this.httpClient.post<IngestResponse>(url, formdata);
  }

  manualIngest(team: string, site: string, company: string, changes: IngestChange[]): 
    Observable<IngestResponse> {
    const url = '/scheduler/api/v2/ingest/';
    const data: ManualIngestChanges = {
      teamid: team,
      siteid: site,
      companyid: company,
      changes: changes,
    }
    return this.httpClient.put<IngestResponse>(url, data);
  }
}
