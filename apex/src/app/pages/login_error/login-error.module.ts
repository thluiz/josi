import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { LoginErrorComponent } from './login-error.component';
import { LoginErrorRoutingModule } from './login-error-routing.module';

@NgModule({
    imports: [
        CommonModule,
        LoginErrorRoutingModule
    ],
    declarations: [       
        LoginErrorComponent
    ]
})
export class LoginErrorModule { }
