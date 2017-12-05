import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DailyPagesRoutingModule } from "./daily-pages-routing.module";

import { DailyPageComponent } from './daily-page.component'; 
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    imports: [
        CommonModule,
        DailyPagesRoutingModule,
        NgxDatatableModule,
        FormsModule
    ],
    declarations: [       
        DailyPageComponent
    ]
})
export class DailyPagesModule { }
