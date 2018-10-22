import { PersonAvatarImageModule } from 'app/shared/components/person-avatar-image/person-avatar-image.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ChangeOwnershipModalComponent } from './change-ownership-modal.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      NgbModule,
      PersonAvatarImageModule
    ],
    declarations: [
      ChangeOwnershipModalComponent
    ], exports: [
      ChangeOwnershipModalComponent
    ]
})
export class ChangeOwnershipModalModule { }
