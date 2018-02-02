import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { DiaryHeaderComponent } from './diary-header.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule          
    ],
    declarations: [       
        DiaryHeaderComponent
    ], exports: [
        DiaryHeaderComponent
    ]
})
export class DiaryHeaderModule { }
