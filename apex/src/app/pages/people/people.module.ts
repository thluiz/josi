import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PersonCardModule } from './../../shared/components/person-card/person-card.module';
import { PeopleServiceProviderPageComponent } from './people-service-provider/people-service-provider-page.component';
import { InterestedPanelPageComponent } from './interested/interested-panel-page.component';
import { PersonEditPageComponent } from './edit/person-edit-page.component';
import { PersonPageComponent } from './person/person-page.component';
import { PeopleAwayPageComponent } from './people-away/people-away-panel-page.component';
import { ManagementPanelPageComponent } from './management-panel/management-panel-page.component';
import { MembersPanelPageComponent } from './members-panel/members-panel-page.component';
import { OperatorPageComponent } from 'app/pages/people/operator/operator-page.component';
import { OperatorConfigPageComponent } from './operator-config/operator-config-page.component';

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
import { PersonCommentListModule } from 'app/pages/people/shared/components/person-comment-list/person-comment-list.module';
import { ContactListitemModule } from 'app/shared/components/contact-listitem/contact-listitem.module';
import { PersonDataTreatmentModalModule } from 'app/shared/components/person-data-treatment-modal/person-data-treatment-modal.module';
import { PersonStatusLineModule } from 'app/shared/components/person-status-line/person-status-line.module';
import { PersonContactListModule } from 'app/pages/people/shared/components/person-contact-list/person-contact-list.module';
import { FloatActionCenterModule } from 'app/shared/components/float-action-center/float-action-center.module';
import { VoucherPeoplePageComponent } from './voucher/voucher-people-page.component';


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
        PersonCommentListModule,
        PeopleHeaderModule,
        ChangeMembersViewModule,
        ContactListitemModule,
        FloatActionCenterModule           
    ],
    declarations: [       
        MembersPanelPageComponent,
        ManagementPanelPageComponent,
        PersonPageComponent,
        PersonEditPageComponent,
        InterestedPanelPageComponent,
        PeopleAwayPageComponent,
        PeopleServiceProviderPageComponent,
        OperatorPageComponent,
        OperatorConfigPageComponent,
        VoucherPeoplePageComponent
    ]
})
export class PeopleModule { }
