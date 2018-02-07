import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { OrganizationCardComponent } from './organization-card.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OperatorCardModule } from 'app/shared/components/operator-card/operator-card.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        OperatorCardModule        
    ],
    declarations: [       
        OrganizationCardComponent
    ], exports: [
        OrganizationCardComponent
    ]
})
export class OrganizationCardModule { }
