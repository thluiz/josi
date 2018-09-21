import { ApplicationPipesModule } from 'app/app-pipes.module';
import { RouterModule } from '@angular/router';
import { NewInicidentModalComponent } from './new-incident-modal.component';

import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PersonAvatarImageModule } from 'app/shared/components/person-avatar-image/person-avatar-image.module';
import { NgPipesModule } from 'ngx-pipes';
import { OwnershipTitleModule } from 'app/pages/diary/shared/ownership-title/ownership-title.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,
        PersonAvatarImageModule,
        NgPipesModule,
        ApplicationPipesModule,
        OwnershipTitleModule
    ],
    declarations: [
        NewInicidentModalComponent
    ], exports: [
        NewInicidentModalComponent
    ]
})
export class NewIncidentModalModule { }
