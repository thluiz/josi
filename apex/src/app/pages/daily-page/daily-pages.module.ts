import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { DailyPagesRoutingModule } from "./daily-pages-routing.module";

import { DailyPageComponent } from './daily-page.component'; 

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        DailyPagesRoutingModule,        
        FormsModule
    ],
    declarations: [       
        DailyPageComponent
    ]
})
export class DailyPagesModule { }
