import { FormsModule } from '@angular/forms';
import { OrganizationCardComponent } from './organization-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PersonCardModule        
    ],
    declarations: [       
        OrganizationCardComponent
    ], exports: [
        OrganizationCardComponent
    ]
})
export class OrganizationCardModule { }
