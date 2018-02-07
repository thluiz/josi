
import { CardsRoutingModule } from './cards-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragulaModule } from 'ng2-dragula';

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
import { DiaryHeaderModule } from 'app/pages/diary/shared/diary-header/diary-header.module';
import { OrganizationCardModule } from 'app/pages/cards/shared/organization-card/organization-card.module';

import { OrganizationsOverviewPageComponent } from './organizations-overview-page/organizations-overview-page.component';
import { OrganizationDetailPageComponent } from 'app/pages/cards/organization-detail-page/organization-detail-page.component';
import { PersonCardModule } from 'app/shared/components/person-card/person-card.module';
import { OrganizationConfigPageComponent } from 'app/pages/cards/organization-config-page/organization-config-page.component';
import { OperatorCardModule } from 'app/shared/components/operator-card/operator-card.module';


@NgModule({
    imports: [
        CardsRoutingModule,
        CommonModule,
        FormsModule,                                 
        ReactiveFormsModule,                        
        NgbModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),        
        MarkdownModule.forRoot(),
        DiaryHeaderModule,
        OrganizationCardModule,
        DragulaModule,
        OperatorCardModule
    ],
    declarations: [    
        OrganizationsOverviewPageComponent,
        OrganizationDetailPageComponent,
        OrganizationConfigPageComponent   
    ]
})
export class CardsModule { }
