import { FormsModule } from '@angular/forms';
import { DiaryChangeViewComponent } from './change-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FormsModule          
    ],
    declarations: [       
        DiaryChangeViewComponent
    ], exports: [
        DiaryChangeViewComponent
    ]
})
export class DailyChangeViewModule { }
