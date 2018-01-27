import { IncidentService } from 'app/services/incident-service';
import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export enum CommentType {
  Person,
  Incident
}

@Component({
  selector: 'add-comment-modal',
  templateUrl: './add-comment-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],  
})
export class AddCommentModalComponent implements OnInit {  
  person;   
  incident;     
  comment;
  type;  
  types = CommentType;

  @ViewChild('add_comment_modal') add_comment_modal: ElementRef;
  
  constructor(private personService: PersonService, 
    private ngbModalService: NgbModal,
    private incidentService: IncidentService) {   
  }

  private person_id() {
    if(!this.person) {
      console.log("person nd");
      return 0;
    }
      
    return this.person.id || this.person.person_id
  }

  ngOnInit() {    

  }  

  ngOnDestroy () {
    
  }

  open(parameter, type: CommentType) {    
    if(type == CommentType.Person) {
      this.person = parameter;
    }
    if(type == CommentType.Incident) {
      this.incident = parameter;
    }
    this.type = type;
    this.open_modal(this.add_comment_modal, true);        
  }

  private open_modal(content, on_close_action = false) {
    this.ngbModalService.open(content).result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }   

  save_person_comment(close_action) {
    this.personService.saveCommentAboutPerson(this.person, this.comment).subscribe(
    (data) => {
      this.comment = "";
      this.person = null;
      
      if(close_action) {
        close_action();
      }
    });
  }

  save_incident_comment(close_action) {
    this.incidentService.saveComment(this.incident, this.comment).subscribe(
    (data) => {
      this.comment = "";
      this.incident = null;

      console.log("aa");
      console.log(close_action);

      if(close_action) {
        close_action();
      }
    });
  }
}