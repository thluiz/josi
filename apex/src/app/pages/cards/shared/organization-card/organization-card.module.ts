import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { OrganizationCardComponent } from './organization-card.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OperatorCardModule } from 'app/shared/components/operator-card/operator-card.module';

import { Card } from 'app/shared/models/card.model';
import { LeaderedProjectsPipe } from "app/pages/cards/shared/leadered-projects.pipe";
import { CompactCardModule } from "app/pages/cards/shared/compact-card/compact-card.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        OperatorCardModule,
        CompactCardModule        
    ],
    declarations: [       
        OrganizationCardComponent, LeaderedProjectsPipe
    ], exports: [
        OrganizationCardComponent
    ]
})
export class OrganizationCardModule { }
