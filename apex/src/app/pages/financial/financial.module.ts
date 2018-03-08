import { FinancialRoutingModule } from './financial-routing.module';
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

import { OverviewPageComponent } from 'app/pages/financial/overview/overview-page.component';
import { IncidentFinancialListitemModule } from 'app/shared/components/incident-financial-listitem/incident-financial-listitem.module';


@NgModule({
    imports: [
        FinancialRoutingModule,
        CommonModule,
        FormsModule,                                 
        ReactiveFormsModule,                        
        NgbModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),        
        MarkdownModule.forRoot(),        
        DragulaModule,
        IncidentFinancialListitemModule
    ],
    declarations: [    
        OverviewPageComponent
    ]
})
export class FinancialModule { }
