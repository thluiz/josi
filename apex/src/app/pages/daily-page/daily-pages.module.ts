import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DailyPagesRoutingModule } from "./daily-pages-routing.module";

import { DailyPageComponent } from './daily-page.component'; 
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@NgModule({
    imports: [
        CommonModule,
        DailyPagesRoutingModule,
        NgxDatatableModule   
    ],
    declarations: [       
        DailyPageComponent
    ]
})
export class DailyPagesModule { }
