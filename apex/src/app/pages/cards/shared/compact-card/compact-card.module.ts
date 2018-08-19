import { PersonCardModule } from './../../../../shared/components/person-card/person-card.module';
import { CommonModule } from "@angular/common";
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { CompactCardComponent } from './compact-card.component';
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
        CompactCardComponent
    ], exports: [
        CompactCardComponent
    ]
})
export class CompactCardModule { }
