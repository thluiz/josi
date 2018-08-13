import { Result } from 'app/shared/models/result';

import {zip as observableZip,  Subscription } from 'rxjs';

import {filter } from 'rxjs/operators';
import { Card } from 'app/shared/models/card.model';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { PersonService } from 'app/services/person-service';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';


@Component({
  selector: 'person-communication-treatment-modal',
  templateUrl: './person-communication-treatment-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter},
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})

export class PersonComunicationTreatmentModalComponent implements OnInit {
  person;
  branches = [];
  pending: { person: any[], incidents: any[], communications: Card[] } = { person: [], incidents: [], communications: [] };
  contacts = [];
  principal_contacts = [];
  show_only_principal_contacts = true;
  has_aditional_contacts = false;

  @ViewChild('comunication_treatment_modal') comunication_treatment_modal: ElementRef;

  private person_changes_subscriber: Subscription;
  private incident_changes_subscriber: Subscription;

  constructor(private personService: PersonService,
    private parameterService: ParameterService,
    private ngbModalService: NgbModal,
    private datePickerConfig: NgbDatepickerConfig) {

      datePickerConfig.firstDayOfWeek = 7
  }

  private person_id() {
    if(!this.person) {
      console.log("person nd");
      return 0;
    }

    return this.person.id || this.person.person_id
  }

  ngOnInit() {
    this.person_changes_subscriber = this.personService.personChanges$.pipe(
    filter((data) => data != null && data.id == this.person_id()))
    .subscribe((data) => {
      this.load_data();
    });
  }

  ngOnDestroy () {
    this.person_changes_subscriber.unsubscribe();
    this.incident_changes_subscriber.unsubscribe();
  }

  open(person) {
    this.person = person;
    observableZip(
      this.personService.getData(this.person_id()),
      this.personService.getPendingCommunication(this.person_id()),
      this.personService.getPersonContacts(this.person_id()),
      this.parameterService.getActiveBranches(),
      (result_person_data: Result<any>,
        result_pending_data: Result<any>,
        result_contacts: Result<any>,
        result_branches: Result<any[]>) => {

        this.person = result_person_data.data;
        this.pending = result_pending_data.data.pending[0];
        this.person = this.pending.person[0];
        this.load_contacts(result_contacts.data);
        this.branches = result_branches.data;

        if(this.contacts.length > 0 && this.principal_contacts.length == 0) {
          this.show_only_principal_contacts = false;
        }

        this.open_modal(this.comunication_treatment_modal, true);

      }).subscribe();
  }

  open_new_contact(content) {
    this.parameterService.getContactTypes().subscribe(() => {
      this.open_modal(content);
    });
  }

  private open_modal(content, on_close_action = false) {
    this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then(() => {

    }, (reason) => {
        console.log(reason);
    });
  }

  private load_data() {
    this.personService.getPendingCommunication(this.person_id()).subscribe((missing_data) => {
      this.pending = missing_data as any;
    });
  }

  private load_contacts(contacts) {
    this.contacts = contacts;
    this.principal_contacts = this.contacts.filter(ct => ct.principal);
    this.has_aditional_contacts = this.principal_contacts.length > 0
                                  && this.principal_contacts.length != this.contacts.length;
    this.show_only_principal_contacts = this.contacts.filter(ct => ct.principal).length > 0;
  }
}
