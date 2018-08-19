import { isArray } from 'util';
import { LightIncident } from 'app/shared/models/incident-model';
import { ApplicationEventService } from 'app/services/application-event-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService, ModalType } from 'app/services/modal-service';
import {
  IncidentService,
  INCIDENT_ADDED,
  INCIDENT_STARTED,
  INCIDENT_ENDED
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
    activities: LightIncident[] = [];
    @Input() branch = 0;

    private subscriber : Subscription;
    private incident_ended_subscriber : Subscription;

    constructor(private incidentService: IncidentService,
      private modalService: ModalService,
      private securityService: SecurityService,
      private eventManager: ApplicationEventService) {

    }

    ngOnInit() {
      this.securityService.getCurrentUserData()
      .subscribe((result_user : Result<any>) => {
        this.branch = result_user.data.default_branch_id || 0;
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
      .subscribe((result : Result<LightIncident[]>) => {

        if(!isArray(this.activities)) {
          this.activities = [];
        }

        this.activities = this.activities
        .concat(result.data)
        .sort((a, b) => {
          if(a.started_date_in_seconds > b.started_date_in_seconds) return 1;
          if(a.started_date_in_seconds < b.started_date_in_seconds) return -1;
          return 0;
        });
      });

      this.incident_ended_subscriber = this.eventManager.event$
      .pipe(
        filter((ev:Result) => ev.data != null),
        filter((ev:Result) =>
            ev.type == INCIDENT_ENDED
        ),
        filter((ev:Result<LightIncident[]>) => isArray(ev.data) && ev.data.length > 0),
        filter((ev:Result<LightIncident[]>) =>
            !this.branch || (isArray(ev.data) && ev.data[0].branch_id == this.branch)
        )
      )
      .subscribe((result : Result) => {
        let idx = this.activities.findIndex(act => act.id == result.data[0].id);
        if(idx > 0) {
          this.activities[idx].closed = true;
        }
      });
    }

    ngOnDestroy() {
        if(this.subscriber) {
          this.subscriber.unsubscribe();
        }

        if(this.incident_ended_subscriber) {
          this.incident_ended_subscriber.unsubscribe();
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
