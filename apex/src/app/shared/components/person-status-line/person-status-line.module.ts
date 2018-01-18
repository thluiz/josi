import { RouterModule } from '@angular/router';
import { PersonStatusLineComponent } from './person-status-line.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule          
    ],
    declarations: [       
        PersonStatusLineComponent
    ], exports: [
        PersonStatusLineComponent
    ]
})
export class PersonStatusLineModule { }
