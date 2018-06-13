import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { IncidentAgendaListitemModule } from 'app/shared/components/incident-agenda-listitem/incident-agenda-listitem.module';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PersonIncidentHistoryListComponent } from './person-incident-history-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        IncidentAgendaListitemModule,
        NgbDatepickerModule.forRoot(),
    ],
    declarations: [       
        PersonIncidentHistoryListComponent
    ], exports: [
        PersonIncidentHistoryListComponent
    ]
})
export class PersonIncidentHistoryListModule { }
