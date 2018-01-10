import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MarkdownModule } from 'ngx-markdown';
import { FormControl, FormsModule, ReactiveFormsModule,
        FormGroup, Validators, NgForm } from '@angular/forms';

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

import { DailyPagesRoutingModule } from "./daily-pages-routing.module";
import { DailyPageComponent } from './daily-page.component'; 


@NgModule({
    imports: [
        CommonModule,
        DailyPagesRoutingModule,                
        FormsModule, 
        ReactiveFormsModule,                        
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        DailyPageComponent
    ]
})
export class DailyPagesModule { }
