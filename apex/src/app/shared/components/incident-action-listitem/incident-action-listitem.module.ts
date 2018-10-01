import { ApplicationPipesModule } from './../../../app-pipes.module';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { MarkdownModule } from 'ngx-markdown';
import { IncidentActionListitemComponent } from './incident-action-listitem.component';

@NgModule({
    imports: [
        CommonModule,
        ApplicationPipesModule,
        MarkdownModule.forRoot()
    ],
    declarations: [
      IncidentActionListitemComponent
    ], exports: [
      IncidentActionListitemComponent
    ]
})
export class IncidentActionListitemModule { }
