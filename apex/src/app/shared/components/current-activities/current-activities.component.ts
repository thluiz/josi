import { isArray } from 'util';
import { LightIncident } from 'app/shared/models/incident-model';
import { ApplicationEventService } from 'app/services/application-event-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService, ModalType } from 'app/services/modal-service';
import {
  IncidentService,
  INCIDENT_ADDED,
  INCIDENT_STARTED
} from 'app/services/incident-service';

import { Subscription } from 'rxjs';
import { SecurityService } from 'app/services/security-service';
import { filter } from 'rxjs/operators';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'current-activities',
  templateUrl: './current-activities.component.html',
  styleUrls: ['./current-activities.scss'],
})
export class CurrentActivitiesComponent implements OnInit, OnDestroy {
    activities: any = [];
    @Input() branch = 0;

    private subscriber : Subscription;

    constructor(private incidentService: IncidentService,
      private modalService: ModalService,
      private securityService: SecurityService,
      private eventManager: ApplicationEventService) {

    }

    ngOnInit() {
      this.securityService.getCurrentUserData().subscribe((user) => {
        this.branch = user.default_branch_id || 0;
        this.getCurrentActivities();
      });

      this.subscriber = this.eventManager.event$
      .pipe(
        filter((ev:Result) => ev.data != null),
        filter((ev:Result) =>
            ev.type == INCIDENT_ADDED || ev.type == INCIDENT_STARTED
        ),
        filter((ev:Result<LightIncident[]>) => isArray(ev.data) && ev.data.length > 0),
        filter((ev:Result<LightIncident[]>) =>
            !this.branch
            || (isArray(ev.data) && ev.data[0].branch_id == this.branch)
        ),
        /** only reload list in IncidentAddedActions when payload contains started incidents */
        filter((ev: Result<LightIncident[]>) =>
          ev.type != INCIDENT_ADDED //typescript does not ensure type
          || ev.data.findIndex(i => i.started_on != null) >= 0)
      )
      .subscribe((data : Result) => {
        this.getCurrentActivities();
      });
    }

    ngOnDestroy() {
        if(this.subscriber) {
          this.subscriber.unsubscribe();
        }
    }

    show_incident_details(incident) {
        this.modalService.open(ModalType.IncidentTreatment, incident);
    }

    filter_activities(branch) {
      this.branch = branch;
      this.getCurrentActivities();
    }

    private getCurrentActivities() {
      this.incidentService.getCurrentActivities(this.branch || 0).subscribe((result : Result) => {
        this.activities = result.data;
      });
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