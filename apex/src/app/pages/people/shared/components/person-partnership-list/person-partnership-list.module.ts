import { PersonPartnershipListComponent } from './person-partnership-list.component';
import { RouterModule } from '@angular/router';


import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [       
        PersonPartnershipListComponent
    ], exports: [
        PersonPartnershipListComponent
    ]
})
export class PersonPartnershipListModule { }
