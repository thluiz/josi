import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbDatepickerModule, NgbTimepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';
import { ApplicationPipesModule } from '../../../app-pipes.module';
import { IncidentActionTreatmentModalComponent } from 'app/shared/components/incident-action-treatment-modal/incident-action-treatment-modal.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      RouterModule,
      NgbDatepickerModule.forRoot(),
      NgbTimepickerModule.forRoot(),
      NgbModule,
      MarkdownModule.forRoot(),
      ApplicationPipesModule
    ],
    declarations: [
      IncidentActionTreatmentModalComponent
    ], exports: [
      IncidentActionTreatmentModalComponent
    ]
})
export class IncidentActionTreatmentModalModule { }
