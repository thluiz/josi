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

import { PersonEditPageComponent } from './person-edit-page.component';
import { PersonEditRoutingModule } from 'app/pages/people/edit/person-edit-routing.module';

@NgModule({
    imports: [
        CommonModule,
        PersonEditRoutingModule,
        FormsModule, 
        ReactiveFormsModule,                        
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        MarkdownModule.forRoot()
    ],
    declarations: [       
        PersonEditPageComponent
    ]
})
export class PersonEditPageModule { }
