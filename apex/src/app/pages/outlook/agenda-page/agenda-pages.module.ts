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

import { AgendaPagesRoutingModule } from "./agenda-pages-routing.module";
import { AgendaPageComponent } from './agenda-page.component'; 


@NgModule({
    imports: [
        CommonModule,
        AgendaPagesRoutingModule,                
        FormsModule, 
        ReactiveFormsModule,                        
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        AgendaPageComponent
    ]
})
export class AgendaPagesModule { }
