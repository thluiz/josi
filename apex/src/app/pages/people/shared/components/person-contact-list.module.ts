import { RouterModule } from '@angular/router';
import { PersonContactListComponent } from './person-contact-list.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NewContactFormModule } from 'app/shared/components/new-contact-form/new-contact-form.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NewContactFormModule
    ],
    declarations: [       
        PersonContactListComponent
    ], exports: [
        PersonContactListComponent
    ]
})
export class PersonContactListModule { }
