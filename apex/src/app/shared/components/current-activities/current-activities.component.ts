import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService, ModalType } from 'app/services/modal-service';
import { IncidentService } from 'app/services/incident-service';
import { PersonService } from 'app/services/person-service';

import { Subscription } from 'rxjs';

@Component({
  selector: 'current-activities',
  templateUrl: './current-activities.component.html',
  styleUrls: ['./current-activities.scss'],
})
export class CurrentActivitiesComponent implements OnInit, OnDestroy {    
    activities: any = [];
    @Input() branch = 0;
    private update_activities_timer;
    private incident_changes_subscriber: Subscription;
    private incident_added_subscriber: Subscription;
    private person_changes_subscriber: Subscription;

    constructor(private incidentService: IncidentService, 
      private modalService: ModalService, 
      private personService: PersonService) {

    }  

    ngOnInit() {
      this.getCurrentActivities();

      this.incident_changes_subscriber = this.incidentService.incidentsChanges$
      .delay(1000)
      .subscribe((next) => {      
        this.getCurrentActivities();
      });


      this.incident_added_subscriber = this.incidentService.incidentAdd$
      .delay(1000)
      .subscribe((next) => {      
        this.getCurrentActivities();
      });

      this.person_changes_subscriber = this.personService.personChanges$
      .delay(1000).subscribe((next) => {      
        this.getCurrentActivities();
      });
    }

    ngOnDestroy() {      
      if(this.update_activities_timer) {
        clearTimeout(this.update_activities_timer);
      }
      this.incident_added_subscriber.unsubscribe();
      this.incident_changes_subscriber.unsubscribe();
      this.person_changes_subscriber.unsubscribe();
    }

    show_incident_details(incident) {
        this.modalService.open(ModalType.IncidentTreatment, incident);
    }

    private getCurrentActivities() {
      this.incidentService.getCurrentActivities(this.branch || 0).subscribe((data) => {
        this.activities = data.json();
      });

      if(this.update_activities_timer) {
        clearTimeout(this.update_activities_timer);
      }
  
      this.update_activities_timer = setTimeout(() => { this.getCurrentActivities() }, 90000);
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