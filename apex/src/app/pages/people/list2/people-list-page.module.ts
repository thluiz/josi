import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PeopleList2PageComponent } from './people-list-page.component';
import { PeopleList2RoutingModule } from './people-list-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        PeopleList2RoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        NgbModule
    ],
    declarations: [       
        PeopleList2PageComponent
    ]
})
export class PeopleList2PageModule { }
