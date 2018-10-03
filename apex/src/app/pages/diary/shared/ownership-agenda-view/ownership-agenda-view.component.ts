import { ToastrService } from 'ngx-toastr';
import { NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OnInit, OnDestroy } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Ownership } from "app/shared/models/ownership";
import { ModalService, ModalType } from "app/services/modal-service";
import {
  IncidentService,
  INCIDENT_RESCHEDULED,
  INCIDENT_EVENT_PREFIX,
  INCIDENT_ADDED
} from "app/services/incident-service";

import { Subscription, Observable } from "rxjs";
import { ApplicationEventService } from "app/services/application-event-service";
import { Result } from "app/shared/models/result";
import { LightIncident } from "app/shared/models/incident-model";
import { filter } from "rxjs/operators";
import { ParameterService } from "app/services/parameter-service";
import { IncidentAction } from "../../../../shared/models/incident-action-model";

@Component({
  selector: "ownership-agenda-view",
  templateUrl: "./ownership-agenda-view.component.html",
  styleUrls: ["./ownership-agenda-view.component.scss"]
})
export class OwnershipAgendaViewComponent implements OnInit, OnDestroy {
  @Input()
  ownership: Ownership;

  @Input()
  current_branch;

  @Input()
  incidents: LightIncident[] = [];

  @Input()
  actions: IncidentAction[] = [];

  saving = false;
  from_today: boolean;

  lower_if_closed_today =  true;

  private ownership_events_subscriber: Subscription;
  private incidents_events_subscriber: Subscription;

  constructor(
    private modalService: ModalService,
    private incidentService: IncidentService,
    private eventManager: ApplicationEventService,
    private toastrService: ToastrService,
    private parameterService: ParameterService,
    private ngbModalService: NgbModal
  ) {


  }

  ngOnDestroy(): void {
    if (this.ownership_events_subscriber) {
      this.ownership_events_subscriber.unsubscribe();
    }

    if (this.incidents_events_subscriber) {
      this.incidents_events_subscriber.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.ownership_events_subscriber = this.eventManager.event$
      .pipe(
        filter(
          (result: Result<LightIncident[]>) =>
            result.data &&
            result.data.length > 0 &&
            result.type.indexOf(INCIDENT_EVENT_PREFIX) > -1 &&
            result.data.map(d => d.id).includes(this.ownership.id)
        )
      )
      .subscribe(result => {
        this.ownership = result.data[0] as any;
        this.saving = false;
      });

    this.incidents_events_subscriber = this.eventManager.event$
      .pipe(
        filter(
          (result: Result<LightIncident[]>) =>
            result.data &&
            result.data.length > 0 &&
            result.type.indexOf(INCIDENT_EVENT_PREFIX) > -1 &&
            result.data.map(d => d.ownership_id).includes(this.ownership.id)
        )
      )
      .subscribe((result: Result<LightIncident[]>) => {
        if (result.type == INCIDENT_ADDED) {
          this.incidents = this.incidents.concat(
            result.data.filter(i => i.ownership_id == this.ownership.id)
          );
        }
      });

      this.checkOwnershipFromToday();
  }

  private checkOwnershipFromToday() {
    this.from_today = false;
    if(!this.ownership) {
      return;
    }

    const today = new Date();
    const ownership_date = new Date(this.ownership.date);

    if(!ownership_date) {
      return;
    }

    this.from_today = today.getUTCFullYear() == ownership_date.getUTCFullYear() &&
                      today.getUTCMonth() == ownership_date.getUTCMonth() &&
                      today.getUTCDate() == ownership_date.getUTCDate();
  }

  show_incident_details(incident) {
    this.modalService.open(ModalType.IncidentTreatment, incident);
  }

  start_incident(incident) {
    this.saving = true;
    this.incidentService.start_incident(incident).subscribe(result => {
      this.saving = false;
    });
  }

  stop_incident(incident) {
    this.saving = true;
    this.incidentService.close_incident(incident).subscribe(result => {
      this.saving = false;

      if(!result.success) {
        this.toastrService.error(result.error ? result.error.message : result.message);
        return;
      }
    });
  }

  open_new_activity_modal() {
    this.modalService.open(ModalType.AddIncident, {
      branch_id: this.current_branch || this.ownership.branch_id,
      ownership: this.ownership
    });
  }
}
