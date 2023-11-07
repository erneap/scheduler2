import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PtoHolidayBelowDialogComponent } from './pto-holiday-below-dialog/pto-holiday-below-dialog.component';
import { MaterialModule } from '../material.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ForgotPasswordResetComponent } from './forgot-password-reset/forgot-password-reset.component';
import { HeaderMenuComponent } from './header-menu/header-menu.component';
import { LoginComponent } from './login/login.component';
import { PasswordExpireDialogComponent } from './password-expire-dialog/password-expire-dialog.component';
import { HeaderComponent } from './header.component';
import { WaitDialogComponent } from './wait-dialog/wait-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PtoHolidayBelowDialogComponent,
    ForgotPasswordComponent,
    ForgotPasswordResetComponent,
    HeaderMenuComponent,
    LoginComponent,
    PasswordExpireDialogComponent,
    HeaderComponent,
    WaitDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderComponent
  ]
})
export class HeaderModule { }
