import { RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewCardModalComponent } from './new-card-modal.component';
import { PersonAvatarImageModule } from 'app/shared/components/person-avatar-image/person-avatar-image.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        PersonAvatarImageModule
    ],
    declarations: [
        NewCardModalComponent
    ], exports: [
        NewCardModalComponent
    ]
})
export class NewCardModalModule { }
