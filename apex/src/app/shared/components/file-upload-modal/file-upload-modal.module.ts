import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileUploadModalComponent } from './file-upload-modal.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,        
        NgbModule        
    ],
    declarations: [       
        FileUploadModalComponent
    ], exports: [
        FileUploadModalComponent
    ]
})
export class FileUploadModalModule { }
