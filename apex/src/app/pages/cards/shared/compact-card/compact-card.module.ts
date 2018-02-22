import { PersonCardModule } from './../../../../shared/components/person-card/person-card.module';
import { Card } from 'app/shared/models/card.model';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompactCardComponent } from './compact-card.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PersonCardModule     
    ],
    declarations: [       
        CompactCardComponent
    ], exports: [
        CompactCardComponent
    ]
})
export class CompactCardModule { }
