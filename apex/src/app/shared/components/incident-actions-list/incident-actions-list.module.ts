import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MarkdownModule } from 'ngx-markdown';

import { IncidentActionsListComponent } from './incident-actions-list.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MarkdownModule.forRoot()
    ],
    declarations: [
      IncidentActionsListComponent
    ], exports: [
      IncidentActionsListComponent
    ]
})
export class IncidentActionsListModule { }
