import { zip as observableZip, Observable, of } from 'rxjs';
import { debounceTime, delay, map, distinctUntilChanged, catchError, tap, switchMap } from 'rxjs/operators';

import { ParameterService } from 'app/services/parameter-service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { PersonService } from 'app/services/person-service';
import { IncidentService } from 'app/services/incident-service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LightIncident } from '../../models/incident-model';
import { Result } from 'app/shared/models/result';
import { UtilsService } from '../../../services/utils-service';


@Component({
  selector: 'new-incident-modal',
  templateUrl: './new-incident-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [DatePickerI18n,
    { provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter },
    { provide: NgbDatepickerI18n, useClass: PortugueseDatepicker }]
})

export class NewInicidentModalComponent implements OnInit {

  @Input() current_branch: any;

  available_ownerships : LightIncident[] = []
  new_incident: any;
  modalRef;
  branches: any;
  incident_types: any;
  errors: string[] = [];

  @ViewChild('add_incident_modal') add_incident_modal: ElementRef;

  constructor(private datePickerConfig: NgbDatepickerConfig,
    private ngbModalService: NgbModal,
    private personService: PersonService,
    private incidentService: IncidentService,
    private utilsService: UtilsService,
    private parameterService: ParameterService) {

    datePickerConfig.firstDayOfWeek = 7
  }

  ngOnInit() {
    this.reset_new_incident();
  }

  reset_new_incident_type() {
    this.new_incident.type = null;
    this.new_incident.tmp_type = null;
    this.new_incident.tmp_combo_type = null;
    this.new_incident.children_type = null;
    this.validate_new_event();
  }

  open(initial_state = {}) {
    this.reset_new_incident(initial_state);
    observableZip(
      this.parameterService.getActiveBranches(),
      this.parameterService.getIncidentTypes(),
      (branches, incident_types: any[]) => {
        this.branches = branches;
        this.incident_types = incident_types.filter(i => !i.automatically_generated);

        this.open_modal(this.add_incident_modal, true);
      }
    ).subscribe();
  }

  private open_modal(content, on_close_action = false) {
    this.modalRef = this.ngbModalService.open(content);

    this.modalRef.result.then((result) => {

    }, (reason) => {
      console.log(reason);
    });
  }

  searching_people;
  search_failed;

  people_typeahead_formatter = (x) => x.name;

  search_people = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching_people = true),
      switchMap(term =>
        this.personService.search(term).pipe(
          map(response => {
            return <string[]>response;
          }),
          tap(() => this.search_failed = false),
          catchError(() => {
            this.search_failed = true;
            return of([]);
          }), )),
      tap(() => this.searching_people = false), )

  add_person_to_new_incident(event) {
    if (!event.name) {
      return;
    }

    if (!this.new_incident.people) {
      this.new_incident.people = [];
    }

    this.new_incident.people.push(event);
    this.new_incident.tmp_person = "";
    this.validate_new_event();
  }

  remove_person_from_new_incident(person) {
    this.new_incident.people = this.new_incident.people.filter(p => p.person_id != person.person_id);
    this.validate_new_event();
  }

  validate_new_event_value() {
    if (parseFloat(this.new_incident.value) != NaN) {
      this.validate_new_event();
      return;
    }
    this.new_incident.value = 0;
    this.validate_new_event();
  }

  validate_new_event() {
    let new_incident = this.new_incident;
    this.errors = [];

    if (new_incident.people != null
      && new_incident.people.length > 0
      && new_incident.type != null
      && new_incident.branch_id > 0
      && (!new_incident.type.require_title
        || (new_incident.title || "").length > 3
        || (new_incident.title || "").length > 50)
      && (!this.new_incident.type.need_description
        || (this.new_incident.description || "").length > 5)
      && (
        !this.new_incident.type.need_value
        || this.new_incident.value > 0
      )
      && (
        !this.new_incident.require_ownership
        || ( this.new_incident.require_ownership
            && (this.new_incident.new_owner_id > 0
                || this.new_incident.ownership_id > 0))
      )
    ) {
      this.new_incident.correct = true;
      return;
    }

    if (!new_incident.type) {
      this.new_incident.correct = false;
      this.errors.push("Informe o tipo de evento");
      return;
    }

    if (new_incident.type.require_ownership
        && (this.new_incident.new_owner_id <= 0
            || (!this.new_incident.ownership || this.new_incident.ownership.id <= 0))) {
      this.errors.push("Escolha uma titularidade para o evento ou indique quem será o titular e o suplente entre os participantes");
    }

    if (new_incident.type.require_title && (new_incident.title || "").length < 3) {
      this.errors.push("Informe o título");
    }

    if (new_incident.type.require_title && (new_incident.title || "").length > 50) {
      this.errors.push("O título precisa ser menor que 50 caracteres");
    }

    if (new_incident.type.need_description
      && (new_incident.description || "").length <= 5) {
      this.errors.push("Informe a descrição");
    }

    this.new_incident.correct = false;
  }

  change_new_incident_type(tp) {
    const t = this.incident_types.filter(t => t.id == tp);
    if (t.length != 1) {
      return;
    }
    const type = t[0];

    if (type.childrens != null) {
      this.new_incident.type = null;
      this.new_incident.tmp_type = type;
      this.new_incident.correct = false;
    } else {
      this.new_incident.tmp_type = type;
      this.new_incident.type = type;
    }
  }

  change_new_incident_children_type(tp) {
    const t = this.new_incident.tmp_type.childrens.filter(t => t.id == tp);
    if (t.length != 1) {
      return;
    }
    const type = t[0];
    this.new_incident.children_type = type;
    this.new_incident.type = type;
  }

  get_available_ownerships() {
    if(!this.new_incident.branch_id
      || !this.new_incident.type
      || !this.new_incident.type.require_ownership
      || !this.new_incident.date
      || !this.new_incident.time)
      return;

    const date = this.utilsService.translate_date_time_to_server(
      this.new_incident.date, this.new_incident.time
    );

    this.incidentService.getAvailableOwnerships(
      this.new_incident.branch_id, date, this.new_incident.type.id)
      .subscribe((result : Result<LightIncident[]>) => {
          this.available_ownerships = result.data;
      });
  }

  register_new_incident(close_action) {
    this.validate_new_event();
    if(!this.new_incident.correct)
      return;

    this.incidentService.register_new_incident(this.new_incident).pipe(
      tap((next) => this.reset_new_incident()))
      .subscribe((result) => {
        if(close_action)
          close_action();
      });
  }

  reset_new_incident(initial_state?) {
    if (!initial_state) {
      initial_state = {}
    }

    if (initial_state.start_activity == undefined || initial_state.start_activity == null) {
      initial_state.start_activity = 0;
    }

    let date = new Date();

    this.new_incident = {
      branch_id: initial_state.branch_id,
      people: initial_state.people || [],
      contact_text: "",
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      },
      time: {
        hour: date.getHours(),
        minute: date.getMinutes()
      }
    };
  }

}