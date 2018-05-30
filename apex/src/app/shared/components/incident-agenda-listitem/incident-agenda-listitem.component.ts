import { LightIncident } from './../../models/incident-model';
import { ApplicationEventService } from 'app/services/application-event-service';

import { OnInit, OnDestroy } from '@angular/core';
import { IncidentService, INCIDENT_ACTION_PREFIX } from 'app/services/incident-service';
import { ModalService, ModalType } from 'app/services/modal-service';

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Result } from 'app/shared/models/result';

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
              private eventManager: ApplicationEventService,
              private modalService: ModalService) {
            
    }  

    ngOnInit() {  
      this.incidents_subscriber = this.eventManager
      .event$
      .pipe(
        filter((result : Result<LightIncident[]>) =>  
        result.data && result.data.length > 0
        && result.data[0].id == this.incident.id
        && result.type.indexOf(INCIDENT_ACTION_PREFIX) > -1)
      ).subscribe((result) => {      
        this.incident = result.data[0];
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