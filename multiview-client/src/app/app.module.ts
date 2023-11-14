import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { HeaderModule } from './header/header.module';
import { AppStateService } from './services/app-state.service';
import { AuthService } from './services/auth.service';
import { DialogService } from './services/dialog-service.service';
import { EmployeeService } from './services/employee.service';
import { LogsService } from './services/logs.service';
import { QueryService } from './services/query.service';
import { SiteService } from './services/site.service';
import { TeamService } from './services/team.service';
import { interceptorProviders } from './services/spin-interceptor.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { EmployeeModule } from './employee/employee.module';
import { SiteModule } from './site/site.module';
import { QueryModule } from './query/query.module';
import { GenericModule } from './generic/generic.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HeaderModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    EmployeeModule,
    SiteModule,
    QueryModule,
    GenericModule
  ],
  providers: [
    AppStateService,
    AuthService,
    DialogService,
    EmployeeService,
    LogsService,
    QueryService,
    SiteService,
    TeamService,
    interceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
