import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PeopleListPageComponent } from './people-list-page.component';
import { PeopleListRoutingModule } from 'app/pages/people/list/people-list-routing.module';

@NgModule({
    imports: [
        CommonModule,
        PeopleListRoutingModule
    ],
    declarations: [       
        PeopleListPageComponent
    ]
})
export class PeopleListPageModule { }
