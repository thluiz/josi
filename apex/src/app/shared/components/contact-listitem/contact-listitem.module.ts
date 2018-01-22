import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ContactListitemComponent } from 'app/shared/components/contact-listitem/contact-listitem.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [       
        ContactListitemComponent
    ], exports: [
        ContactListitemComponent
    ]
})
export class ContactListitemModule { }
