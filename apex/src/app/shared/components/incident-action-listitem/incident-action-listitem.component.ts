import { ApplicationEventService } from "app/services/application-event-service";

import {
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import {
  IncidentService,
  INCIDENT_ACTION_PREFIX,
  INCIDENT_ACTION_CHANGED,
  INCIDENT_ACTION_COMMENT_ADDED
} from "app/services/incident-service";
import { ModalService, ModalType } from "app/services/modal-service";

import { Component, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

import { Result } from "app/shared/models/result";
import { IncidentAction } from "app/shared/models/incident-action-model";
import { LightIncident } from "app/shared/models/incident-model";
import { IncidentActionIncidentData } from "app/shared/models/incident-action-incident-data.model";

@Component({
  selector: "incident-action-listitem",
  templateUrl: "./incident-action-listitem.component.html",
  styleUrls: ["./incident-action-listitem.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentActionListitemComponent implements OnInit, OnDestroy {
  saving = false;

  @Input()
  action: IncidentAction;

  @Input()
  incident: LightIncident;

  incidentData: IncidentActionIncidentData;

  private subscriber: Subscription;

  constructor(
    private incidentService: IncidentService,
    private eventManager: ApplicationEventService,
    private modalService: ModalService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriber = this.eventManager.event$
      .pipe(
        filter(
          (result: Result<IncidentAction[]>) =>
            result.data &&
            result.data.length > 0 &&
            result.type.indexOf(INCIDENT_ACTION_PREFIX) >= 0 &&
            result.data.map(ia => ia.id).includes(this.action.id)
        )
      )
      .subscribe(result => {
        if(result.type == INCIDENT_ACTION_CHANGED
           || result.type == INCIDENT_ACTION_COMMENT_ADDED) {
          this.action = result.data.find(ia => ia.id == this.action.id);
          this.incidentData = this.action
                    .incidents.find(
                      i => this.incident != null && i.id == this.incident.id
          );
        }
        this.saving = false;
        this.cd.detectChanges();
      });

    if(this.action && this.incident) {
      this.incidentData = this.action.incidents.find(i => i.id == this.incident.id);
    }
  }

  postpone() {
    this.modalService.open(ModalType.IncidentActionTreatment, {
      action: this.action,
      ownership: this.incident
    });
  }

  add_comment() {
    this.modalService.open(ModalType.AddIncidentActionComment, this.action);
  }

  complete() {
    this.saving = true;
    this.incidentService.completeAction(this.action).subscribe((result) => {
      this.saving = false;
      this.action = result.data[0];
    })
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
  }

  canBeCompleted() {
    return !this.action.completed;
  }

  canBeTreated() {
    if(this.action.completed) {
      return false;
    }

    return !this.incidentData || (this.incidentData && !this.incidentData.treated);
  }
}
