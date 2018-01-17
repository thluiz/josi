import { FormsModule } from '@angular/forms';
import { DailyChangeViewComponent } from './change-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FormsModule          
    ],
    declarations: [       
        DailyChangeViewComponent
    ], exports: [
        DailyChangeViewComponent
    ]
})
export class DailyChangeViewModule { }
