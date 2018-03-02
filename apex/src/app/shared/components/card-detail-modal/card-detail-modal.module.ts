
import { MarkdownModule } from 'ngx-markdown';
import { CardDetailModalComponent } from './card-detail-modal.component';
import { NewContactFormModule } from 'app/shared/components/new-contact-form/new-contact-form.module';
import { ContactListitemModule } from 'app/shared/components/contact-listitem/contact-listitem.module';
import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';
import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        ContactListitemModule,
        NewContactFormModule,
        PersonCardModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        CardDetailModalComponent
    ], exports: [
        CardDetailModalComponent
    ]
})
export class CardDetailModalModule { }
