import { PersonStatusLineModule } from './../person-status-line/person-status-line.module';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IncidentAgendaListitemComponent } from './incident-agenda-listitem.component';

@NgModule({
    imports: [
        CommonModule,
        PersonStatusLineModule
    ],
    declarations: [       
        IncidentAgendaListitemComponent
    ], exports: [
        IncidentAgendaListitemComponent
    ] 
})
export class IncidentAgendaListitemModule { }
