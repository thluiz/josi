import { ContactButtonitemModule } from '../contact-buttonitem/contact-buttonitem.module';
import { ContactListitemModule } from '../contact-listitem/contact-listitem.module';
import { PersonStatusLineModule } from './../person-status-line/person-status-line.module';
import { PersonAvatarImageModule } from '../person-avatar-image/person-avatar-image.module';

import { RouterModule } from '@angular/router';
import { PersonCardComponent } from './person-card.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FilterPrincipalPipeModule } from 'app/shared/pipes/filter-principal/filter-principal.module';
import { FilterPrincipalPipe } from 'app/shared/pipes/filter-principal/filter-principal.pipe';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PersonStatusLineModule,
        ContactListitemModule,
        ContactButtonitemModule,
        FilterPrincipalPipeModule,
        PersonAvatarImageModule,
        MarkdownModule.forRoot()
    ],
    declarations: [
        PersonCardComponent, FilterPrincipalPipe
    ], exports: [
        PersonCardComponent
    ]
})
export class PersonCardModule { }
