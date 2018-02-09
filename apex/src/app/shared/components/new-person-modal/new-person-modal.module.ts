import { RouterModule } from '@angular/router';
import { NewPersonModalComponent } from './new-person-modal.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule    
    ],
    declarations: [       
        NewPersonModalComponent
    ], exports: [
        NewPersonModalComponent
    ]
})
export class NewPersonModalModule { }
