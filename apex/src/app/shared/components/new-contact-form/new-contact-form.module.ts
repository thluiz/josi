
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NewContactFormComponent } from './new-contact-form.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [       
        NewContactFormComponent
    ], exports: [
        NewContactFormComponent
    ]
})
export class NewContactFormModule { }
