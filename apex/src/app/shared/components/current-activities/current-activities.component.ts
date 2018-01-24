import { ModalService, ModalType } from 'app/services/modal-service';
import { IncidentService } from 'app/services/incident-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
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

    constructor(private incidentService: IncidentService, private modalService: ModalService) {

    }  

    ngOnInit() {
      this.getCurrentActivities();

      this.incident_changes_subscriber = this.incidentService.incidentsChanges$.subscribe((next) => {      
        this.getCurrentActivities();
      });
    }

    ngOnDestroy() {      
      if(this.update_activities_timer) {
        clearTimeout(this.update_activities_timer);
      }

      this.incident_changes_subscriber.unsubscribe();
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
}