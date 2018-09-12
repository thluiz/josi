
import {filter} from 'rxjs/operators';

import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef }
from '@angular/core';

import { ParameterService } from 'app/services/parameter-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, Observable } from 'rxjs';
import { ModalService, ModalType } from 'app/services/modal-service';
import { MarkdownService } from 'ngx-markdown';
import { IncidentService } from 'app/services/incident-service';

@Component({
  selector: 'incident-actions-list',
  templateUrl: './incident-actions-list.component.html',
  styleUrls: ['./incident-actions-list.component.scss']
})
export class IncidentActionsListComponent implements OnInit, OnDestroy {

  comments: any;
  @Input() incident:any;
  @ViewChild('content') modal: ElementRef;


  private comment_changes_subscriber: Subscription;

  constructor(private modalService: ModalService,
    private parameterService: ParameterService,
    private incidentService: IncidentService,
    private markdownService: MarkdownService,
    private ngbModalService: NgbModal) {

  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
