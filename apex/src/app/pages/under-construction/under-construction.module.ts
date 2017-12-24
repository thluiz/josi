import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { UnderConstructionComponent } from './under-construction.component';
import { UnderConstructionRoutingModule } from 'app/pages/under-construction/under-construction-routing.module';

@NgModule({
    imports: [
        CommonModule,
        UnderConstructionRoutingModule
    ],
    declarations: [       
        UnderConstructionComponent
    ]
})
export class UnderConstructionModule { }
