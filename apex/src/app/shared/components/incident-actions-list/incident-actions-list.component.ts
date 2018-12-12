import { filter } from "rxjs/operators";

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from "@angular/core";

import { ParameterService } from "app/services/parameter-service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

import { Subscription, Observable } from "rxjs";
import { ModalService, ModalType } from "app/services/modal-service";
import { MarkdownService } from "ngx-markdown";
import {
  IncidentService,
  INCIDENT_ACTION_ADDED,
  INCIDENT_EVENT_PREFIX
} from "app/services/incident-service";
import { ApplicationEventService } from "app/services/application-event-service";
import { Result } from "app/shared/models/result";
import { IncidentAction } from "../../models/incident-action-model";

@Component({
  selector: "incident-actions-list",
  templateUrl: "./incident-actions-list.component.html",
  styleUrls: ["./incident-actions-list.component.scss"]
})
export class IncidentActionsListComponent implements OnInit, OnDestroy {
  @Input()
  actions: IncidentAction[] = [];

  @Input()
  incident: any;

  @ViewChild("content")
  modal: ElementRef;

  new_action: any;
  saving = false;

  private incident_actions_subscriber: Subscription;
  private incident_actions_comments_subscriber: Subscription;

  constructor(
    private modalService: ModalService,
    private parameterService: ParameterService,
    private incidentService: IncidentService,
    private markdownService: MarkdownService,
    private eventManager: ApplicationEventService,
    private ngbModalService: NgbModal
  ) {}

  ngOnInit() {
    this.markdownService.renderer.paragraph = (text: string) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
      return `<p style="margin-bottom:0">${text}</p>`;
    };

    this.incident_actions_subscriber = this.eventManager.event$
      .pipe(
        filter(
          (result: Result<any>) =>
            result.data &&
            result.data.length > 0 &&
            result.type.indexOf(INCIDENT_EVENT_PREFIX) >= 0 &&
            result.type == INCIDENT_ACTION_ADDED &&
            result.data.map(d => d.incident_id).includes(this.incident.id)
        )
      )
      .subscribe(result => {
        if (result.type == INCIDENT_ACTION_ADDED) {
          this.actions = (this.actions || []).concat(result.data);
        }
      });
  }

  ngOnDestroy() {
    if (this.incident_actions_subscriber) {
      this.incident_actions_subscriber.unsubscribe();
    }

    if (this.incident_actions_comments_subscriber) {
      this.incident_actions_comments_subscriber.unsubscribe();
    }
  }

  openAddModal(content) {
    this.saving = false;
    this.new_action = {};
    this.open_modal(content);
  }

  saveNewAction(close_action) {
    this.saving = true;
    this.incidentService
      .addIncidentAction(this.incident, this.new_action)
      .subscribe(() => {
        if (close_action) {
          close_action();
        }
      });
  }

  private open_modal(content, on_close_action?: () => void) {
    let modalRef = this.ngbModalService.open(content);

    modalRef.result.then(
      () => {},
      reason => {
        console.log(reason);

        if (on_close_action) {
          on_close_action();
        }
      }
    );
  }
}
