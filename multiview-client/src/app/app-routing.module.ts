import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './header/login/login.component';
import { EmployeeScheduleComponent } from './employee/employee-schedule/employee-schedule.component';
import { HomeComponent } from './home/home.component';

const desktop_routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'employee',
    children: [
      {path: 'schedule', component: EmployeeScheduleComponent},
    ]
  },
  {path: '**', redirectTo: 'home'}
];

const mobile_routes: Routes = [];

const tablet_routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(desktop_routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
