import { CardEditModalComponent } from './card-edit-modal.component';
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
        NgbModule
    ],
    declarations: [       
        CardEditModalComponent
    ], exports: [
        CardEditModalComponent
    ]
})
export class CardEditModalModule { }
