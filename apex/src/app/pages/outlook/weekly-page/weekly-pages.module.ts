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

import { WeeklyPagesRoutingModule } from "./weekly-pages-routing.module";
import { WeeklyPageComponent } from './weekly-page.component'; 


@NgModule({
    imports: [
        CommonModule,
        WeeklyPagesRoutingModule,                
        FormsModule, 
        ReactiveFormsModule,                        
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        WeeklyPageComponent
    ]
}) 
export class WeeklyPagesModule { }
