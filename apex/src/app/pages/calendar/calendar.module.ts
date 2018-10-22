import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FullCalendarModule } from 'ng-fullcalendar';

import {
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbModule
} from '@ng-bootstrap/ng-bootstrap';

import { MarkdownModule } from 'ngx-markdown';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CoveragePageComponent } from './coverage-page/coverage-page.component';


@NgModule({
    imports: [
        CalendarRoutingModule,

        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        MarkdownModule.forRoot(),
        FullCalendarModule
    ],
    declarations: [
      CoveragePageComponent
    ]
})
export class CalendarModule { }
