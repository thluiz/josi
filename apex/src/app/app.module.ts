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

import { IncidentService } from 'app/services/incident-service';
import { PersonService } from './services/person-service';
import { ParameterService } from 'app/services/parameter-service';
import { UtilsService } from 'app/services/utils-service';
import { ModalService } from 'app/services/modal-service';

import { PersonDataTreatmentModalModule } from 'app/shared/components/person-data-treatment-modal/person-data-treatment-modal.module';
import { IncidentTreatmentModalModule } from 'app/shared/components/incident-treatment-modal/incident-treatment-modal.module';
import { AddCommentModalModule } from 'app/shared/components/add-comment-modal/add-comment-modal.module';
import { IncidentCommentsListModalModule } from 'app/shared/components/incident-comments-list-modal/incident-comments-list-modal.module';

import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityHttpInterceptor } from './httpinterceptor'

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
        PersonDataTreatmentModalModule,
        IncidentTreatmentModalModule,
        AddCommentModalModule,
        IncidentCommentsListModalModule,
        NgbModule.forRoot(),                        
        HttpClientModule,
        //BrowserModule,
        //FormsModule, 
        //JsonpModule
    ],
    providers: [
        { 
            provide: HTTP_INTERCEPTORS, 
            useClass: SecurityHttpInterceptor, 
            multi: true 
        },
        AuthService,
        AuthGuard,
        ParameterService,
        PersonService,
        IncidentService,
        UtilsService,
        ModalService                    
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }