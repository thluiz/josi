import { RouterModule } from '@angular/router';
import { PersonCommentListComponent } from './person-comment-list.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NewContactFormModule } from 'app/shared/components/new-contact-form/new-contact-form.module';
import { ContactListitemModule } from 'app/shared/components/contact-listitem/contact-listitem.module';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NewContactFormModule,
        ContactListitemModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        PersonCommentListComponent
    ], exports: [
        PersonCommentListComponent
    ]
})
export class PersonCommentListModule { }
