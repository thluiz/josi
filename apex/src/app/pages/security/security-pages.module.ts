import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';

import { SecurityPagesRoutingModule } from "./security-pages-routing.module";

import { ForgotPasswordPageComponent } from "./forgot-password/forgot-password-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { ResetPasswordPageComponent } from './reset-password/reset-password-page.component';
import { LoadLoginComponent } from './load-login-data/load-login-data.component';


@NgModule({
    imports: [
        CommonModule,
        SecurityPagesRoutingModule,
        FormsModule
    ],
    declarations: [
        ForgotPasswordPageComponent,
        LoginPageComponent,
        ResetPasswordPageComponent,
        LoadLoginComponent
    ]
})
export class SecurityPagesModule { }
