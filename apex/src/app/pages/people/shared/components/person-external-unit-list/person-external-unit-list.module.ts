import { RouterModule } from '@angular/router';


import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PersonExternalUnitListComponent } from './person-external-unit-list.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule
    ],
    declarations: [       
        PersonExternalUnitListComponent
    ], exports: [
        PersonExternalUnitListComponent
    ]
})
export class PersonExternalUnitListModule { }
