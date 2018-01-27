import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { LateralSummaryComponent } from 'app/shared/components/lateral-summary/lateral-summary.component';

@NgModule({
    imports: [
        CommonModule        
    ],
    declarations: [       
        LateralSummaryComponent
    ], exports: [
        LateralSummaryComponent
    ] 
})
export class LateralSummaryModule { }
