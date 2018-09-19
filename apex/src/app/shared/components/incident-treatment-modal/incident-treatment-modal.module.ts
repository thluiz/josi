import { RouterModule } from '@angular/router';

import { PersonIncidentHistoryListModule } from 'app/shared/components/person-incident-history-list/person-incident-history-list.module';
import { IncidentTreatmentModalComponent } from './incident-treatment-modal.component';
import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { ApplicationPipesModule } from '../../../app-pipes.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        MarkdownModule.forRoot(),
        PersonCardModule,
        PersonIncidentHistoryListModule,
        ApplicationPipesModule
    ],
    declarations: [
        IncidentTreatmentModalComponent
    ], exports: [
        IncidentTreatmentModalComponent
    ]
})
export class IncidentTreatmentModalModule { }
