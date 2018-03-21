import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MoveCardModalComponent } from 'app/shared/components/move-card-modal/move-card-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,        
        NgbModule        
    ],
    declarations: [       
        MoveCardModalComponent
    ], exports: [
        MoveCardModalComponent
    ]
})
export class MoveCardModalModule { }
