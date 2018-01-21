import { RouterModule } from '@angular/router';
import { PersonContactListComponent } from 'app/pages/people/shared/components/person-contact-list.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";


@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [       
        PersonContactListComponent
    ], exports: [
        PersonContactListComponent
    ]
})
export class PersonContactListModule { }
