import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PersonCardModule } from './../../shared/components/person-card/person-card.module';
import { PersonStatusLineModule } from 'app/shared/components/person-status-line/person-status-line.module';
import { PersonContactListModule } from 'app/pages/people/shared/components/person-contact-list/person-contact-list.module';

import { ManagementPanelPageComponent } from './management-panel/management-panel-page.component';
import { MembersPanelPageComponent } from './members-panel/members-panel-page.component';
import { PersonPageComponent } from 'app/pages/people/person/person-page.component';
import { PersonEditPageComponent } from 'app/pages/people/edit/person-edit-page.component';
import { PersonDataTreatmentModalModule } from 'app/shared/components/person-data-treatment-modal/person-data-treatment-modal.module';

import { PeopleRoutingModule } from './people-routing.module';

import { NgbModal, 
    NgbDateStruct, 
    NgbDatepickerI18n, 
    NgbDatepickerModule,
    NgbCalendar, 
    NgbTimeStruct,      
    ModalDismissReasons, 
    NgbTimepickerModule,
    NgbActiveModal,
    NgbModule     
} from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { PeopleHeaderModule } from 'app/pages/people/shared/components/people-header/people-header.module';
import { ChangeMembersViewModule } from 'app/pages/people/shared/components/change-members-view/change-members-view.module';

@NgModule({
    imports: [
        CommonModule,
        PeopleRoutingModule,
        FormsModule,                                 
        ReactiveFormsModule,                        
        NgbModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),        
        MarkdownModule.forRoot(),        
        PersonCardModule,
        PersonContactListModule,
        PersonStatusLineModule,
        PersonDataTreatmentModalModule,
        PeopleHeaderModule,
        ChangeMembersViewModule             
    ],
    declarations: [       
        MembersPanelPageComponent,
        ManagementPanelPageComponent,
        PersonPageComponent,
        PersonEditPageComponent
    ]
})
export class PeopleModule { }
