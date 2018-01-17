import { RouterModule } from '@angular/router';
import { CompactIncidentListitemComponent } from './compact-incident-listitem.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [       
        CompactIncidentListitemComponent
    ], exports: [
        CompactIncidentListitemComponent
    ]
})
export class CompactIncidentListitemModule { }
