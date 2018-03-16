import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';
import { NewContactFormModule } from 'app/shared/components/new-contact-form/new-contact-form.module';
import { ContactListitemModule } from 'app/shared/components/contact-listitem/contact-listitem.module';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonComunicationTreatmentModalComponent } from './person-communication-treatment-modal.component';
import { IncidentCommunicationListitemModule } from 'app/shared/components/incident-communication-listitem/incident-communication-listitem.module';
import { TaskTreatmentCardModule } from 'app/shared/components/task-treatment-card/task-treatment-card.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        ContactListitemModule,
        NewContactFormModule,
        IncidentCommunicationListitemModule,
        PersonCardModule,
        TaskTreatmentCardModule
    ],
    declarations: [       
        PersonComunicationTreatmentModalComponent
    ], exports: [
        PersonComunicationTreatmentModalComponent
    ]
})
export class PersonComunicationTreatmentModalModule { }
