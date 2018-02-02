import { FormsModule } from '@angular/forms';
import { DiaryChangeBranchComponent } from './change-branch.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FormsModule          
    ],
    declarations: [       
        DiaryChangeBranchComponent
    ], exports: [
        DiaryChangeBranchComponent
    ]
})
export class DiaryChangeBranchModule { }
