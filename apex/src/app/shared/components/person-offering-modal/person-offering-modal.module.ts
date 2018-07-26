import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';
import { PersonIndicationListModule } from 'app/shared/components/person-indication-list/person-indication-list.module';

import { PersonOfferingModalComponent } from './person-offering-modal.component';

import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        PersonIndicationListModule,
        PersonCardModule
    ],
    declarations: [
        PersonOfferingModalComponent
    ], exports: [
        PersonOfferingModalComponent
    ]
})
export class PersonOfferingModalModule { }
