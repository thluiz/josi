
import { zip as observableZip, Observable, of, Subscription } from 'rxjs';

import { filter, debounceTime, delay, map, distinctUntilChanged, catchError, tap, switchMap } from 'rxjs/operators';
import { ModalService, ModalType } from '../../../services/modal-service';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from '../../datepicker-i18n';
import { PersonService } from '../../../services/person-service';
import { IncidentService } from '../../../services/incident-service';
import { UtilsService } from '../../../services/utils-service';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from '../../../services/parameter-service';
import { Result } from '../../models/result';


@Component({
  selector: 'person-data-treatment-modal',
  templateUrl: './person-data-treatment-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [DatePickerI18n,
    { provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter },
    { provide: NgbDatepickerI18n, useClass: PortugueseDatepicker }]
})

export class PersonDataTreatmentModalComponent implements OnInit {
  person;
  branches = [];
  missing_data = [];
  contacts = [];
  principal_contacts = [];
  show_only_principal_contacts = true;
  has_aditional_contacts = false;

  @ViewChild('data_treatment_modal') data_treatment_modal: ElementRef;

  private contact_changes_subscriber: Subscription;
  private person_changes_subscriber: Subscription;

  constructor(private personService: PersonService,
    private parameterService: ParameterService,
    private utilsService: UtilsService,
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private datePickerConfig: NgbDatepickerConfig) {

    datePickerConfig.firstDayOfWeek = 7
  }

  private person_id() {
    if (!this.person) {
      console.log("person nd");
      return 0;
    }

    return this.person.id || this.person.person_id
  }

  ngOnInit() {
    this.person_changes_subscriber = this.personService.personChanges$.pipe(
      filter((data) => data != null && data.id == this.person_id()))
      .subscribe((result_data) => {
        this.personService.getPersonMissingData(this.person_id())
        .subscribe((result_missing_data : Result<any>) => {
          this.missing_data = result_missing_data.data as any;
        });
      });

    this.contact_changes_subscriber = this.personService.contactChanges$.pipe(
      filter((data) => data != null && data.person_id == this.person_id()))
      .subscribe((data) => {
        this.personService.getPersonContacts(this.person_id()).subscribe((result_data : Result<any>) => {
          this.load_contacts(result_data.data)

          this.personService.getPersonMissingData(this.person_id()).subscribe((result_missing_data :  Result<any>) => {
            this.missing_data = result_missing_data.data as any;
          });
        });
      });
  }

  ngOnDestroy() {
    this.contact_changes_subscriber.unsubscribe();
    this.person_changes_subscriber.unsubscribe();
  }

  open(person) {
    this.person = person;
    observableZip(
      this.personService.getData(this.person_id()),
      this.personService.getPersonMissingData(this.person_id()),
      this.personService.getPersonContacts(this.person_id()),
      this.parameterService.getActiveBranches(),
      (result_person_data: Result<any[]>,
        result_missing_data: Result<any[]>,
        result_contacts: Result<any>,
        result_branches: Result<any[]>) => {

        this.person = result_person_data.data[0];
        this.missing_data = result_missing_data.data as any;
        this.load_contacts(result_contacts.data);
        this.branches = result_branches.data;

        if (this.contacts.length > 0 && this.principal_contacts.length == 0) {
          this.show_only_principal_contacts = false;
        }

        this.open_modal(this.data_treatment_modal, true);

      }).subscribe();
  }

  open_send_member_card_image() {

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

  save_birth_date() {
    this.personService.getData(this.person_id()).subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.birth_date = this.utilsService.translate_date_to_server(this.person.birth_date);
      this.personService.savePersonData(person_data).subscribe(() => {

      });
    });
  }

  save_enrollment_date() {
    this.personService.getData(this.person_id()).subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.enrollment_date = this.utilsService.translate_date_to_server(this.person.enrollment_date);
      this.personService.savePersonData(person_data).subscribe((data) => {
      });
    });
  }

  save_admission_date() {
    this.personService.getData(this.person_id()).subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.admission_date = this.utilsService.translate_date_to_server(this.person.admission_date);
      this.personService.savePersonData(person_data).subscribe();
    });
  }

  save_kf_name() {
    this.personService.getData(this.person_id()).subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.kf_name = this.person.kf_name;
      this.personService.savePersonData(person_data).subscribe();
    });
  }

  save_identification2() {
    this.personService.getData(this.person_id())
    .subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.identification2 = this.person.identification2;
      this.personService.savePersonData(person_data).subscribe();
    });
  }

  save_identification() {
    this.personService.getData(this.person_id())
    .subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.identification = this.person.identification;
      this.personService.savePersonData(person_data).subscribe();
    });
  }

  save_occupation() {
    this.personService.getData(this.person_id())
    .subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.occupation = this.person.occupation;
      this.personService.savePersonData(person_data).subscribe();
    });
  }

  save_branch() {
    this.personService.getData(this.person_id())
    .subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.branch_id = this.person.branch_id;
      this.personService.savePersonData(person_data).subscribe();
    });
  }

  save_kf_name_ideograms() {
    this.personService.getData(this.person_id())
    .subscribe((result_data: Result<any>) => {
      let person_data = result_data.data as any;
      person_data.kf_name_ideograms = this.person.kf_name_ideograms;
      this.personService.savePersonData(person_data).subscribe();
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
