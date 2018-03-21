import { IncidentFinancialListitemModule } from './../incident-financial-listitem/incident-financial-listitem.module';
import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';
import { NewContactFormModule } from 'app/shared/components/new-contact-form/new-contact-form.module';
import { ContactListitemModule } from 'app/shared/components/contact-listitem/contact-listitem.module';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonFinancialTreatmentModalComponent } from './person-financial-treatment-modal.component';
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
        IncidentFinancialListitemModule,
        PersonCardModule,
        TaskTreatmentCardModule
    ],
    declarations: [       
        PersonFinancialTreatmentModalComponent
    ], exports: [
        PersonFinancialTreatmentModalComponent
    ]
})
export class PersonFinancialTreatmentModalModule { }
