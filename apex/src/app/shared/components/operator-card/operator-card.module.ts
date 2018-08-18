import { PersonStatusLineModule } from './../person-status-line/person-status-line.module';
import { RouterModule } from '@angular/router';
import { OperatorCardComponent } from './operator-card.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PersonAvatarImageModule } from 'app/shared/components/person-avatar-image/person-avatar-image.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        PersonStatusLineModule,
        PersonAvatarImageModule
    ],
    declarations: [
        OperatorCardComponent
    ], exports: [
        OperatorCardComponent
    ]
})
export class OperatorCardModule { }
