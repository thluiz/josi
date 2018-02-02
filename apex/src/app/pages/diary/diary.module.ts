import { CompactIncidentListitemModule } from './../../shared/components/compact-incident-listitem/compact-incident-listitem.module';
import { NewIncidentModalModule } from './../../shared/components/new-incident-modal/new-incident-modal.module';
import { PersonCardModule } from './../../shared/components/person-card/person-card.module';
import { DailyChangeViewModule } from './shared/change-view/change-view.module';
import { PersonStatusLineModule } from 'app/shared/components/person-status-line/person-status-line.module';
import { CurrentActivitiesModule } from 'app/shared/components/current-activities/current-activities.module';
import { IncidentAgendaListitemModule } from 'app/shared/components/incident-agenda-listitem/incident-agenda-listitem.module';
import { LateralSummaryModule } from 'app/shared/components/lateral-summary/lateral-summary.module';
import { DiaryChangeBranchModule } from 'app/pages/diary/shared/change-branch/change-branch.module';
import { DiaryRoutingModule } from './diary-routing.module';

import { AgendaPageComponent } from './agenda-page/agenda-page.component';
import { DailyPageComponent } from './daily-page/daily-page.component';
import { WeeklyPageComponent } from './weekly-page/weekly-page.component';
import { SumaryPageComponent } from './sumary-page/sumary-page.component';
import { CurrentActivitiesPageComponent } from './current-activities-page/current-activities-page.component';
import { DiaryHeaderModule } from 'app/pages/diary/shared/diary-header/diary-header.module';

import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormControl, FormsModule, ReactiveFormsModule,
        FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbModal, 
    NgbDateStruct, 
    NgbDatepickerI18n, 
    NgbDatepickerModule,
    NgbCalendar, 
    NgbTimeStruct,      
    ModalDismissReasons, 
    NgbTimepickerModule,
    NgbActiveModal,
    NgbModule     
  } from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
    imports: [
        CommonModule,
        DiaryRoutingModule,                
        FormsModule, 
        ReactiveFormsModule,                        
        NgbDatepickerModule.forRoot(),
        NgbTimepickerModule.forRoot(),
        NgbModule,        
        DailyChangeViewModule,
        PersonCardModule,
        NewIncidentModalModule,        
        CompactIncidentListitemModule,
        CurrentActivitiesModule,
        PersonStatusLineModule,
        IncidentAgendaListitemModule,
        LateralSummaryModule,
        DiaryHeaderModule,
        DiaryChangeBranchModule,
        MarkdownModule.forRoot()        
    ],
    declarations: [       
        DailyPageComponent,
        WeeklyPageComponent,
        AgendaPageComponent,
        SumaryPageComponent,
        CurrentActivitiesPageComponent
    ]
})
export class DiaryModule { }
