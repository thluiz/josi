
import {filter} from 'rxjs/operators';

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalService, ModalType } from 'app/services/modal-service';
import { Subscription } from 'rxjs';
import { PersonService } from 'app/services/person-service';

@Component({
  selector: 'person-status-line',
  templateUrl: './person-status-line.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class PersonStatusLineComponent implements OnInit {

  @Input() person: any;
  @Input() incident: any;
  @Input() hideCommunicationStatus = false;
  @Input() hideScheduleStatus = false;
  @Input() hideFinancialStatus = false;
  @Input() hideDataStatus = false;

  private person_changes_subscriber: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalService: ModalService,
    private personService: PersonService) {

  }

  ngOnInit() {
    if(this.incident && !this.person) {
      this.person = {
        id: this.incident.person_id,
        comunication_status: this.incident.comunication_status,
        data_status: this.incident.data_status,
        financial_status: this.incident.financial_status,
        scheduling_status: this.incident.scheduling_status,
        comunication_description: this.incident.comunication_description,
        data_status_description: this.incident.data_status_description,
        financial_description: this.incident.financial_description,
        scheduling_description: this.incident.scheduling_description
      };
    }

    this.person_changes_subscriber = this.personService.personChanges$.pipe(
      filter((p) => p.id == this.person.id))
      .subscribe((person) => {
        this.person = person;
      });
  }

  ngOnDestroy() {
    this.person_changes_subscriber.unsubscribe();
  }

  begin_person_data_treatment() {
    this.modalService.open(ModalType.PersonTreatment, this.person);
  }

  begin_person_comunication_treatment() {
    this.modalService.open(ModalType.PersonComunicationTreatment, this.person);
  }

  begin_person_financial_treatment() {
    this.modalService.open(ModalType.PersonFinancialTreatment, this.person);
  }

  begin_person_schedule_treatment() {
    this.modalService.open(ModalType.PersonScheduleTreatment, this.person);
  }
}