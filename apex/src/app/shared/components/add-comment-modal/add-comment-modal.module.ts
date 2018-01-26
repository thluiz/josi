import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddCommentModalComponent } from 'app/shared/components/add-comment-modal/add-comment-modal.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,        
        NgbModule        
    ],
    declarations: [       
        AddCommentModalComponent
    ], exports: [
        AddCommentModalComponent
    ]
})
export class AddCommentModalModule { }
