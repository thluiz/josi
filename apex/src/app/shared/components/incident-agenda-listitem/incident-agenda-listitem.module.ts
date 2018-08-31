import { PersonStatusLineModule } from './../person-status-line/person-status-line.module';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IncidentAgendaListitemComponent } from './incident-agenda-listitem.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
    imports: [
        CommonModule,
        PersonStatusLineModule,
        MarkdownModule.forRoot()
    ],
    declarations: [
        IncidentAgendaListitemComponent
    ], exports: [
        IncidentAgendaListitemComponent
    ]
})
export class IncidentAgendaListitemModule { }
