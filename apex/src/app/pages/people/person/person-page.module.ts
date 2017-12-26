import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PersonPageComponent } from './person-page.component';
import { PersonRoutingModule } from 'app/pages/people/person/person-routing.module';

@NgModule({
    imports: [
        CommonModule,
        PersonRoutingModule
    ],
    declarations: [       
        PersonPageComponent
    ]
})
export class PersonPageModule { }
