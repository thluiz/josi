import { PersonStatusLineModule } from './../person-status-line/person-status-line.module';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IncidentFinancialListitemComponent } from './incident-financial-listitem.component';

@NgModule({
    imports: [
        CommonModule,
        PersonStatusLineModule
    ],
    declarations: [       
        IncidentFinancialListitemComponent
    ], exports: [
        IncidentFinancialListitemComponent
    ] 
})
export class IncidentFinancialListitemModule { }
