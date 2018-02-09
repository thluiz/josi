import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FloatActionCenterComponent } from './float-action-center.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,        
        NgbModule        
    ],
    declarations: [       
        FloatActionCenterComponent
    ], exports: [
        FloatActionCenterComponent
    ]
})
export class FloatActionCenterModule { }
