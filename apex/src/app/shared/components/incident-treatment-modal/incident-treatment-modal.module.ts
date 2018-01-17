import { RouterModule } from '@angular/router';
import { IncidentTreatmentModalComponent } from './incident-treatment-modal.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        IncidentTreatmentModalComponent
    ], exports: [
        IncidentTreatmentModalComponent
    ]
})
export class IncidentTreatmentModalModule { }
