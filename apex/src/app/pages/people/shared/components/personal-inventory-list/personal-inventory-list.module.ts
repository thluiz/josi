import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { PersonalInventoryListComponent } from './personal-inventory-list.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgbModule
    ],
    declarations: [
      PersonalInventoryListComponent
    ], exports: [
      PersonalInventoryListComponent
    ]
})
export class PersonalInventoryListModule { }
