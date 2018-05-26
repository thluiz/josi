import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';
import { PersonIndicationListModule } from 'app/shared/components/person-indication-list/person-indication-list.module';
import { NewContactFormModule } from 'app/shared/components/new-contact-form/new-contact-form.module';
import { ContactListitemModule } from 'app/shared/components/contact-listitem/contact-listitem.module';
import { RouterModule } from '@angular/router';
import { PersonDataTreatmentModalComponent } from './person-data-treatment-modal.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

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
        PersonIndicationListModule,
        PersonCardModule        
    ],
    declarations: [       
        PersonDataTreatmentModalComponent
    ], exports: [
        PersonDataTreatmentModalComponent
    ]
})
export class PersonDataTreatmentModalModule { }
