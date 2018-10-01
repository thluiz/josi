import { ApplicationEventService } from 'app/services/application-event-service';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService, ModalType } from 'app/services/modal-service';
import { Subscription } from 'rxjs';
import { Result } from 'app/shared/models/result';
import { LightIncident } from 'app/shared/models/incident-model';
import { filter } from 'rxjs/operators';
import { INCIDENT_EVENT_PREFIX } from 'app/services/incident-service';

@Component({
  selector: 'compact-incident-listitem',
  templateUrl: './compact-incident-listitem.component.html',
  styleUrls: ['./compact-incident-listitem.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CompactIncidentListitemComponent implements OnInit, OnDestroy {

    @Input() incident: any;

    private incidents_subscriber : Subscription;

    constructor(private modalService: ModalService,
      private eventManager: ApplicationEventService) {

    }

    begin_incident_treatment(incident) {
      this.modalService.open(ModalType.IncidentTreatment, incident);
    }

    ngOnInit() {
      this.incidents_subscriber = this.eventManager
      .event$
      .pipe(
        filter((result : Result<LightIncident[]>) =>
        result.data && result.data.length > 0
        && this.incident
        && result.data[0].id == this.incident.id
        && result.type.indexOf(INCIDENT_EVENT_PREFIX) > -1)
      ).subscribe((result) => {
        this.incident = result.data[0];
      });
    }

    ngOnDestroy() {
      if(this.incidents_subscriber) {
        this.incidents_subscriber.unsubscribe();
      }
    }
}
