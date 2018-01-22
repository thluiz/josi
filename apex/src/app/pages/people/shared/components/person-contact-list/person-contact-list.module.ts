import { RouterModule } from '@angular/router';
import { PersonContactListComponent } from './person-contact-list.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NewContactFormModule } from 'app/shared/components/new-contact-form/new-contact-form.module';
import { ContactListitemModule } from 'app/shared/components/contact-listitem/contact-listitem.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NewContactFormModule,
        ContactListitemModule
    ],
    declarations: [       
        PersonContactListComponent
    ], exports: [
        PersonContactListComponent
    ]
})
export class PersonContactListModule { }
