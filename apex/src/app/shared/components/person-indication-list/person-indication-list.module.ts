import { RouterModule } from '@angular/router';
import { PersonIndicationListComponent } from './person-indication-list.component';

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
        PersonIndicationListComponent
    ], exports: [
        PersonIndicationListComponent
    ]
})
export class PersonIndicationListModule { }
