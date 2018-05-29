import { GenericIncidentAction } from './../../../services/incident-service';
import { OnInit, OnDestroy } from '@angular/core';
import { IncidentService, IncidentAction } from 'app/services/incident-service';
import { ModalService, ModalType } from 'app/services/modal-service';

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'incident-agenda-listitem',
  templateUrl: './incident-agenda-listitem.component.html',
  styleUrls: ['./incident-agenda-listitem.scss'],
})
export class IncidentAgendaListitemComponent implements OnInit, OnDestroy {  
    
    @Input() incident : any; 
    @Input("branch") current_branch = 0;    
    @Input() forceCompact = false;
    @Input() showDate = false;
    @Input() hideName = false;
    @Input() hideStatus = false;
    @Input() hideActions = false;
    @Input() showTitle = false;
    @Input() showCloseText = false;

    private incidents_subscriber : Subscription;

    constructor(private incidentService: IncidentService,
              private modalService: ModalService) {
            
    }  

    ngOnInit() {  
      this.incidents_subscriber = this.incidentService
      .incidentsActions$    
      .pipe(filter(
        (action : GenericIncidentAction) =>  !action.payload 
        || action.payload[0].id == this.incident.id)
      ).subscribe((data) => {      
        this.incident = data.payload[0];
      });
    }
  
    ngOnDestroy() {
      if(this.incidents_subscriber) {
        this.incidents_subscriber.unsubscribe();
      }
    }

    show_incident_details(incident) {      
      this.modalService.open(ModalType.IncidentTreatment, incident);
    }

    start_incident(incident) {      
      this.incidentService.start_incident(incident)
      .subscribe(); 
    }
  
    close_incident(incident) {      
      this.incidentService.close_incident(incident)
      .subscribe(); 
    }
}