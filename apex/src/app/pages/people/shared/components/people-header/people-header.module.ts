import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PeopleHeaderComponent } from 'app/pages/people/shared/components/people-header/people-header.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule          
    ],
    declarations: [       
        PeopleHeaderComponent
    ], exports: [
        PeopleHeaderComponent
    ]
})
export class PeopleHeaderModule { }
