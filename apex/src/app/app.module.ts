import { IncidentService } from 'app/services/incident-service';
import { PersonService } from './services/person-service';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';

import { HttpModule } from '@angular/http';

import * as $ from 'jquery';
import { ParameterService } from './services/parameter-service';
import { UtilsService } from 'app/services/utils-service';

@NgModule({
    declarations: [
        AppComponent,
        FullLayoutComponent,
        ContentLayoutComponent
    ],
    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        SharedModule,
        NgbModule.forRoot(),        
        //BrowserModule,
        //FormsModule, 
        HttpModule,
        //JsonpModule
    ],
    providers: [
        AuthService,
        AuthGuard,
        ParameterService,
        PersonService,
        IncidentService,
        UtilsService              
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }