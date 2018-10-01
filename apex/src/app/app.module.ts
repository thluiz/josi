import { ServiceWorkerModule } from '@angular/service-worker';
import { ApplicationEventService } from 'app/services/application-event-service';
import { FirebaseService } from './services/firebase-service';
import { AppInsightsService, ApplicationInsightsModule } from '@markpieszak/ng-application-insights';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from "./shared/shared.module";

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { ContentLayoutComponent } from "./layouts/content/content-layout.component";
import { FullLayoutComponent } from "./layouts/full/full-layout.component";

import { AuthService } from './shared/auth/auth.service';
import { AuthGuard } from './shared/auth/auth-guard.service';

import { HttpModule } from '@angular/http';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SecurityHttpInterceptor } from './httpinterceptor'
import { environment } from '../environments/environment';

import * as $ from 'jquery';


import { CardService } from 'app/services/card-service';
import { FinancialService } from 'app/services/financial-service';
import { IncidentService } from 'app/services/incident-service';
import { ModalService } from 'app/services/modal-service';
import { ParameterService } from 'app/services/parameter-service';
import { PersonService } from './services/person-service';
import { SecurityService } from 'app/services/security-service';
import { UtilsService } from 'app/services/utils-service';

import { AddCommentModalModule } from 'app/shared/components/add-comment-modal/add-comment-modal.module';
import { CardDetailModalModule } from 'app/shared/components/card-detail-modal/card-detail-modal.module';
import { CardEditModalModule } from 'app/shared/components/card-edit-modal/card-edit-modal.module';
import { FileUploadModalModule } from 'app/shared/components/file-upload-modal/file-upload-modal.module';
import { IncidentCommentsListModalModule } from 'app/shared/components/incident-comments-list-modal/incident-comments-list-modal.module';
import { IncidentTreatmentModalModule } from 'app/shared/components/incident-treatment-modal/incident-treatment-modal.module';
import { NewCardModalModule } from './shared/components/new-card-modal/new-card-modal.module';
import { NewIncidentModalModule } from './shared/components/new-incident-modal/new-incident-modal.module';
import { NewPersonModalModule } from 'app/shared/components/new-person-modal/new-person-modal.module';
import { MoveCardModalModule } from 'app/shared/components/move-card-modal/move-card-modal.module';
import { PersonComunicationTreatmentModalModule } from 'app/shared/components/person-communication-treatment-modal/person-communication-treatment-modal.module';
import { PersonDataTreatmentModalModule } from 'app/shared/components/person-data-treatment-modal/person-data-treatment-modal.module';
import { PersonFinancialTreatmentModalModule } from 'app/shared/components/person-financial-treatment-modal/person-financial-treatment-modal.module';
import { PersonScheduleTreatmentModalModule } from 'app/shared/components/person-schedule-treatment-modal/person-schedule-treatment-modal.module';
import { PersonOfferingModalModule } from './shared/components/person-offering-modal/person-offering-modal.module';
import { IncidentActionTreatmentModalModule } from './shared/components/incident-action-treatment-modal/incident-action-treatment-modal.module';


import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { HttpService } from './services/http-service';
import { ApplicationPipesModule } from 'app/app-pipes.module';

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
        PersonComunicationTreatmentModalModule,
        IncidentTreatmentModalModule,
        AddCommentModalModule,
        IncidentCommentsListModalModule,
        NewPersonModalModule,
        NewIncidentModalModule,
        NewCardModalModule,
        CardDetailModalModule,
        CardEditModalModule,
        MoveCardModalModule,
        FileUploadModalModule,
        PersonFinancialTreatmentModalModule,
        PersonScheduleTreatmentModalModule,
        ApplicationInsightsModule.forRoot({
            instrumentationKey: 'afcbdd7f-c599-45cd-8555-812c83b75ae6'
        }),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule,
        AngularFireAuthModule,
        AngularFireStorageModule,
        ToastrModule.forRoot(),
        PersonOfferingModalModule,
        IncidentActionTreatmentModalModule,
        ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
        ApplicationPipesModule
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
        CardService,
        FinancialService,
        AppInsightsService,
        FirebaseService,
        ApplicationEventService,
        HttpService,

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
