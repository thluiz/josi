import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CurrentActivitiesComponent } from './current-activities.component';
import { IncidentAgendaListitemModule } from 'app/shared/components/incident-agenda-listitem/incident-agenda-listitem.module';

@NgModule({
    imports: [
        CommonModule,
        IncidentAgendaListitemModule
    ],
    declarations: [       
        CurrentActivitiesComponent
    ], exports: [
        CurrentActivitiesComponent
    ] 
})
export class CurrentActivitiesModule { }
