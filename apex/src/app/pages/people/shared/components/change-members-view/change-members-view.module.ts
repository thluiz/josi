import { FormsModule } from '@angular/forms';
import { ChangeMembersViewComponent } from './change-members-view.component';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        FormsModule          
    ],
    declarations: [       
        ChangeMembersViewComponent
    ], exports: [
        ChangeMembersViewComponent
    ]
})
export class ChangeMembersViewModule { }
