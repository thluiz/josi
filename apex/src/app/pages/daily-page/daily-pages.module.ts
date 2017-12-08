import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';


import { NgbModal, 
    NgbDateStruct, 
    NgbDatepickerI18n, 
    NgbDatepickerModule,
    NgbCalendar, 
    NgbTimeStruct,      
    ModalDismissReasons, 
    NgbTimepickerModule,
    NgbActiveModal 
  } from '@ng-bootstrap/ng-bootstrap';

import { DailyPagesRoutingModule } from "./daily-pages-routing.module";
import { DailyPageComponent } from './daily-page.component'; 

@NgModule({
    imports: [
        CommonModule,
        DailyPagesRoutingModule,        
        FormsModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
    ],
    declarations: [       
        DailyPageComponent
    ]
})
export class DailyPagesModule { }
