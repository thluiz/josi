import { PersonCardModule } from './../../shared/components/person-card/person-card.module';
import { ManagementPanelPageComponent } from './management-panel/management-panel-page.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { MembersPanelPageComponent } from './members-panel/members-panel-page.component';
import { PeopleRoutingModule } from './people-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        PeopleRoutingModule,
        FormsModule, 
        ReactiveFormsModule,
        NgbModule,
        PersonCardModule
    ],
    declarations: [       
        MembersPanelPageComponent,
        ManagementPanelPageComponent
    ]
})
export class PeopleModule { }
