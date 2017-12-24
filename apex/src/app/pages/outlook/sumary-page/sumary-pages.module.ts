import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { FormsModule } from '@angular/forms';

import { NgbModal, 
    NgbDateStruct, 
    NgbDatepickerI18n, 
    NgbDatepickerModule,
    NgbCalendar, 
    NgbTimeStruct,          
    NgbTimepickerModule,    
    NgbModule     
  } from '@ng-bootstrap/ng-bootstrap';

import { SumaryPagesRoutingModule } from "./sumary-pages-routing.module";
import { SumaryPageComponent } from './sumary-page.component'; 


@NgModule({
    imports: [
        CommonModule,
        SumaryPagesRoutingModule,                             
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,          
        FormsModule      
    ],
    declarations: [       
        SumaryPageComponent
    ]
})
export class SumaryPagesModule { }
