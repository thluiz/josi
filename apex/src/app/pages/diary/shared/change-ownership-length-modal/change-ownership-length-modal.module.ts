import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ChangeOwnershipLengthModalComponent } from './change-ownership-length-modal.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      NgbModule
    ],
    declarations: [
      ChangeOwnershipLengthModalComponent
    ], exports: [
      ChangeOwnershipLengthModalComponent
    ]
})
export class ChangeOwnershipLengthModalModule { }
