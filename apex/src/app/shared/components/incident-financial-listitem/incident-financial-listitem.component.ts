import { IncidentService } from 'app/services/incident-service';
import { ModalService, ModalType } from 'app/services/modal-service';

import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'incident-financial-listitem',
  templateUrl: './incident-financial-listitem.component.html',
  styleUrls: ['./incident-financial-listitem.scss'],
})
export class IncidentFinancialListitemComponent {  
    
    @Input() incident : any; 
    @Input("branch") current_branch = 0;    
    @Input() forceCompact = false;

    constructor(private incidentService: IncidentService,
              private modalService: ModalService) {
            
    }  

    show_incident_details(incident) {      
      this.modalService.open(ModalType.IncidentTreatment, incident);
    }

    start_incident(incident) {
      let date = new Date();    
      incident.started_on_hour = date.getHours() + ":" + date.getMinutes();
  
      this.incidentService.start_incident(incident)
      .toPromise()    
      .catch((reason) => {
        console.log(reason);
      }); 
    }
  
    close_incident(incident) {
      incident.closed = true;        
  
      this.incidentService.close_incident(incident)
      .toPromise().catch((reason) => {
        console.log(reason);
      }); 
    }
}