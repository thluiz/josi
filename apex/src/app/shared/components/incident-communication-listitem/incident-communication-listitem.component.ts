import { IncidentService } from 'app/services/incident-service';
import { ModalService, ModalType } from 'app/services/modal-service';

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'incident-communication-listitem',
  templateUrl: './incident-communication-listitem.component.html',
  styleUrls: ['./incident-communication-listitem.scss'],
})
export class IncidentCommunicationListitemComponent {  
    
    @Input() incident : any; 
    @Input("branch") current_branch = 0;    
    @Input() forceCompact = false;
    @Input() display_status = false;

    constructor(private incidentService: IncidentService,
              private modalService: ModalService) {
            
    }  

    show_incident_details(incident) {      
      this.modalService.open(ModalType.IncidentTreatment, incident);
    }
}