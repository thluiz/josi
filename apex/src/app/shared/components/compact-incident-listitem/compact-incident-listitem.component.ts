import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, ModalType } from 'app/services/modal-service';

@Component({
  selector: 'compact-incident-listitem',
  templateUrl: './compact-incident-listitem.component.html',
  styleUrls: ['./compact-incident-listitem.scss'],
})

export class CompactIncidentListitemComponent {  
    
    @Input() incident: any;

    constructor(private modalService: ModalService) {
            
    }  

    begin_incident_treatment(incident) {
      this.modalService.open(ModalType.IncidentTreatment, incident);
    }
}