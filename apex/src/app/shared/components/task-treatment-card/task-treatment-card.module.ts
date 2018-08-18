import { TaskTreatmentCardComponent } from './task-treatment-card.component';
import { PersonCardModule } from './../person-card/person-card.module';

import { Card } from 'app/shared/models/card.model';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonAvatarImageModule } from 'app/shared/components/person-avatar-image/person-avatar-image.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PersonCardModule,
        PersonAvatarImageModule
    ],
    declarations: [
        TaskTreatmentCardComponent
    ], exports: [
        TaskTreatmentCardComponent
    ]
})
export class TaskTreatmentCardModule { }
