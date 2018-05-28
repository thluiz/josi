
import {filter} from 'rxjs/operators';

import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } 
from '@angular/core';

import { ParameterService } from 'app/services/parameter-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, Observable } from 'rxjs';
import { ModalService, ModalType } from 'app/services/modal-service';
import { MarkdownService } from 'ngx-markdown';
import { IncidentService } from 'app/services/incident-service';

@Component({
  selector: 'incident-comments-list-modal',
  templateUrl: './incident-comments-list-modal.component.html',  
  styleUrls: ['./incident-comments-list-modal.scss']
})
export class IncidentCommentsListModalComponent implements OnInit, OnDestroy { 

  comments: any;     
  @Input() incident:any;  
  @ViewChild('content') modal: ElementRef;


  private comment_changes_subscriber: Subscription;

  constructor(private modalService: ModalService, 
    private parameterService: ParameterService,
    private incidentService: IncidentService,
    private markdownService: MarkdownService,
    private ngbModalService: NgbModal) {   

  }

  ngOnInit() {    
    this.markdownService.renderer.paragraph = (text: string) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<p style="margin-bottom:0">${text}</p>`;
    };      
    
    if(this.incident) {
      this.load_comments();
    }
  }

  ngOnDestroy() {
    this.comment_changes_subscriber.unsubscribe();
  }
  
  open(incident) {    
    this.incident = incident;
    this.incidentService.getComments(this.incident.id)
    .subscribe((data:any) => {       
      this.comments = data;

      this.ngbModalService.open(this.modal).result.then((result) => {                                  
        
      }, (reason) => {        
          console.log(reason);
      });         
    });
  }

  load_comments() {
    this.incidentService.getComments(this.incident.id)
    .subscribe((data) => this.comments = data);
  }
       
  add_comment(){             
      this.modalService.open(ModalType.AddIncidentComment, this.incident);    
  } 

  archive_comment(comment) {    
    this.incidentService.archiveComment(comment, this.incident).subscribe();
  }
}