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

import { PersonPageComponent } from './person-page.component';
import { PersonRoutingModule } from 'app/pages/people/person/person-routing.module';

@NgModule({
    imports: [
        CommonModule,
        PersonRoutingModule,
        FormsModule, 
        ReactiveFormsModule,                        
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        PersonPageComponent
    ]
})
export class PersonPageModule { }
