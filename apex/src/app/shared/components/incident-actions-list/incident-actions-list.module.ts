import { IncidentActionListitemModule } from './../incident-action-listitem/incident-action-listitem.module';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MarkdownModule } from 'ngx-markdown';

import { IncidentActionsListComponent } from './incident-actions-list.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MarkdownModule.forRoot(),
        IncidentActionListitemModule
    ],
    declarations: [
      IncidentActionsListComponent
    ], exports: [
      IncidentActionsListComponent
    ]
})
export class IncidentActionsListModule { }
