import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PersonAvatarImageComponent } from './person-avatar-image.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,        
    ],
    declarations: [       
        PersonAvatarImageComponent
    ], exports: [
        PersonAvatarImageComponent
    ]
})
export class PersonAvatarImageModule { }
