import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';

import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityHttpInterceptor } from './httpinterceptor'

import * as $ from 'jquery';

import { IncidentService } from 'app/services/incident-service';
import { PersonService } from './services/person-service';
import { ParameterService } from 'app/services/parameter-service';
import { UtilsService } from 'app/services/utils-service';
import { ModalService } from 'app/services/modal-service';
import { SecurityService } from 'app/services/security-service';
import { CardService } from 'app/services/card-service';

import { PersonDataTreatmentModalModule } from 'app/shared/components/person-data-treatment-modal/person-data-treatment-modal.module';
import { IncidentTreatmentModalModule } from 'app/shared/components/incident-treatment-modal/incident-treatment-modal.module';
import { AddCommentModalModule } from 'app/shared/components/add-comment-modal/add-comment-modal.module';
import { IncidentCommentsListModalModule } from 'app/shared/components/incident-comments-list-modal/incident-comments-list-modal.module';
import { NewCardModalModule } from './shared/components/new-card-modal/new-card-modal.module';
import { NewIncidentModalModule } from './shared/components/new-incident-modal/new-incident-modal.module';
import { NewPersonModalModule } from 'app/shared/components/new-person-modal/new-person-modal.module';
import { CardDetailModalModule } from 'app/shared/components/card-detail-modal/card-detail-modal.module';

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
        HttpClientModule,
        PersonDataTreatmentModalModule,
        IncidentTreatmentModalModule,
        AddCommentModalModule,
        IncidentCommentsListModalModule,
        NewPersonModalModule,
        NewIncidentModalModule,
        NewCardModalModule,
        CardDetailModalModule               
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
        ModalService,
        SecurityService,
        CardService                  
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }