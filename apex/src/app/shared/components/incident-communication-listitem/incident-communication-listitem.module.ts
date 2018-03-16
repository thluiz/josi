import { PersonStatusLineModule } from './../person-status-line/person-status-line.module';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IncidentCommunicationListitemComponent } from './incident-communication-listitem.component';

@NgModule({
    imports: [
        CommonModule,
        PersonStatusLineModule
    ],
    declarations: [       
        IncidentCommunicationListitemComponent
    ], exports: [
        IncidentCommunicationListitemComponent
    ] 
})
export class IncidentCommunicationListitemModule { }
