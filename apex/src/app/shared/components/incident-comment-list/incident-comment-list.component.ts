import { LightIncident } from './../../models/incident-model';
import { ApplicationEventService } from 'app/services/application-event-service';

import { OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IncidentService, INCIDENT_COMMENT_ADDED, INCIDENT_COMMENT_ARCHIVED } from 'app/services/incident-service';
import { ModalService, ModalType } from 'app/services/modal-service';

import { Component, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Result } from 'app/shared/models/result';
import { IncidentComment } from 'app/shared/models/IncidentComment';


@Component({
  selector: 'incident-comment-list',
  templateUrl: './incident-comment-list.component.html',
  styleUrls: ['./incident-comment-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IncidentCommentListComponent implements OnInit, OnDestroy {

    @Input() incident: LightIncident;

    saving = false;

    private comments_subscriber: Subscription;

    constructor(private incidentService: IncidentService,
              private eventManager: ApplicationEventService,
              private modalService: ModalService,
              private cd: ChangeDetectorRef) {

    }

    ngOnInit(): void {
      this.comments_subscriber = this.eventManager.event$
        .pipe(
          filter(() => this.incident && this.incident.id > 0),
          filter((result: Result<any[]>) => result.data && result.data.length > 0),
          filter(
            (result: Result<any[]>) =>
              result.type == INCIDENT_COMMENT_ADDED ||
              result.type == INCIDENT_COMMENT_ARCHIVED
          ),
          filter(
            (result: Result<LightIncident[]>) => result.data.map(i => i.id).includes(this.incident.id)
          ),
        )
        .subscribe((result: Result<LightIncident[]>) => {
          let comments = [];
          result.data
            .filter((incident) => incident.id == this.incident.id)
            .forEach(i => {
              comments = comments.concat(i.comments);
            });

          this.incident.comments = comments.sort((a, b) => {
            let dtA = new Date(a.created_at);
            let dtB = new Date(b.created_at);

            if (dtA > dtB) return -1;
            if (dtA == dtB) return 0;
            if (dtA < dtB) return 1;
          });

          this.cd.detectChanges();
        });
    }

    ngOnDestroy(): void {
      this.comments_subscriber.unsubscribe();
    }

    archive_comment(comment) {
      this.saving = true;

      this.incidentService.archiveComment(comment, this.incident)
      .subscribe(() => {
        this.saving = false;
        this.cd.detectChanges();
      });
    }

    add_comment() {
      this.modalService.open(ModalType.AddIncidentComment, this.incident);
    }
}
