import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { IncidentCommentListComponent } from './incident-comment-list.component';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
    imports: [
      CommonModule,
      MarkdownModule.forRoot()
    ],
    declarations: [
      IncidentCommentListComponent
    ], exports: [
      IncidentCommentListComponent
    ]
})
export class IncidentCommentListModule { }
