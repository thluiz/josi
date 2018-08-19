
import {filter} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CardService, CARD_ADDED } from 'app/services/card-service';
import { ParameterService } from 'app/services/parameter-service';
import { ModalService, ModalType } from 'app/services/modal-service';

import { Card } from 'app/shared/models/card.model';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.scss']
})
export class OrganizationCardComponent implements OnInit, OnDestroy {

  @Input() organization : Card;
  @Input() compactView = false;

  private card_actions : Subscription;

  constructor(private parameterService: ParameterService,
              private cardService: CardService,
              private modalService: ModalService) {

  }

  ngOnInit() {
    this.card_actions = this.cardService.cardChanges$.pipe(
    filter(ca => ca.type == CARD_ADDED))
    .subscribe((next) => {
      this.updateOrganization();
    });
  }

  ngOnDestroy() {
    if(this.card_actions) {
      this.card_actions.unsubscribe();
    }
  }

  updateOrganization() {
    this.cardService.getOrganization(this.organization.id, true).subscribe((result_data : Result<Card>) => {
      this.organization = result_data.data;
    })
  }

  add_task(organization) {
    this.modalService.open(ModalType.AddTask, {
      parent: organization
    });
  }

  add_project(organization) {
    this.modalService.open(ModalType.AddProject, {
      parent: organization
    });
  }
}
