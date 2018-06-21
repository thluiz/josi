import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';


import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PersonRelationshipListComponent } from './person-relationship-list.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbModule
    ],
    declarations: [       
        PersonRelationshipListComponent
    ], exports: [
        PersonRelationshipListComponent
    ]
})
export class PersonRelationshipListModule { }
