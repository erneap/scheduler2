import { Component } from '@angular/core';
import { QueryComponent } from './query.component';
import { TeamService } from '../services/team.service';
import { QueryService } from '../services/query.service';
import { DialogService } from '../services/dialog-service.service';
import { FormBuilder } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-query-mobile',
  templateUrl: './query.mobile.html',
  styleUrls: ['./query.mobile.scss']
})
export class QueryMobile extends QueryComponent {
 constructor(
  protected ts: TeamService,
  protected qs: QueryService,
  protected ds: DialogService,
  protected as: AuthService,
  protected fb: FormBuilder
 ) { super(ts, qs, ds, as, fb); }
}
