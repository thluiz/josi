import { ModalService, ModalType } from 'app/services/modal-service';
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
  selector: 'float-action-center',
  templateUrl: './float-action-center.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],  
})
export class FloatActionCenterComponent implements OnInit {  
  
  constructor(private modalService: ModalService) {   
  }

  ngOnInit() {    

  }  

  ngOnDestroy () {
    
  }
  
  open_new_person_modal() {
    this.modalService.open(ModalType.AddPerson, null);
  }

  open_new_activity_modal() {
    this.modalService.open(ModalType.AddIncident, null);
  }
}