import { ToastrService } from 'ngx-toastr';
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
import { Location } from '../../models/location.model';
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
  locations: Location[];
  im_locations: Location[];
  incident_types: any;
  saving = false;
  lock_ownership = false;

  @ViewChild('add_incident_modal') add_incident_modal: ElementRef;

  constructor(private datePickerConfig: NgbDatepickerConfig,
    private ngbModalService: NgbModal,
    private personService: PersonService,
    private incidentService: IncidentService,
    private utilsService: UtilsService,
    private parameterService: ParameterService,
    private toastr: ToastrService) {

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
  }

  compareFn = (item1, item2) => item1 != null && item2 != null && item1.id == item2.id;

  open(initial_state = {}) {
    this.saving = false;
    this.lock_ownership = false;

    observableZip(
      this.parameterService.getActiveBranches(),
      this.parameterService.getActiveLocations(),
      this.parameterService.getIncidentTypes(),
      (result_branches: Result<any[]>,
        result_locations: Result<Location[]>,
        result_incident_types: Result<any[]>) => {
        this.branches = result_branches.data.filter(b => b.category_id != 3);
        this.locations = result_locations.data.filter(l => l.branch);
        this.im_locations = result_locations.data.filter(l => !l.branch);
        this.incident_types = result_incident_types.data.filter(i => !i.automatically_generated);
        this.locations = result_locations.data;

        this.reset_new_incident(initial_state);

        this.reset_new_incident(initial_state);
        this.open_modal(this.add_incident_modal, true);
      }
    ).subscribe();
  }

  private open_modal(content, on_close_action = false) {
    this.modalRef = this.ngbModalService.open(content);

    this.modalRef.result.then(() => {

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
  }

  remove_person_from_new_incident(person) {
    this.new_incident.people = this.new_incident.people.filter(p => p.person_id != person.person_id);
  }

  validate_new_event() {
    let new_incident = this.new_incident;
    let errors = [];

    console.log(new_incident);

    if (new_incident.people != null
      && new_incident.people.length > 0
      && new_incident.type != null
      && new_incident.location
      && new_incident.location.id > 0
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

    if (!new_incident.people || new_incident.people.length == 0) {
      this.new_incident.correct = false;
      errors.push("Informe ao menos um participante");
    }

    if (!new_incident.type) {
      this.new_incident.correct = false;
      errors.push("Informe o tipo de evento");
      errors.forEach(e => this.toastr.error(e, 'Erro de Validação'));
      return;
    }

    if (new_incident.type.require_ownership
        && (this.new_incident.new_owner_id <= 0
            || (!this.new_incident.ownership || this.new_incident.ownership.id <= 0))) {
      errors.push("Escolha uma titularidade para o evento ou indique quem será o titular e o suplente entre os participantes");
    }

    if (new_incident.type.require_title && (new_incident.title || "").length < 3) {
      errors.push("Informe o título");
    }

    if (new_incident.type.require_title && (new_incident.title || "").length > 50) {
      errors.push("O título precisa ser menor que 50 caracteres");
    }

    if (new_incident.type.need_description
      && (new_incident.description || "").length <= 5) {
      errors.push("Informe a descrição");
    }

    errors.forEach(e => this.toastr.error(e, 'Erro de Validação'));
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
      || !this.new_incident.time
      || this.lock_ownership)
      return;

    const date = this.utilsService.translate_date_time_to_server(
      this.new_incident.date, this.new_incident.time
    );

    this.incidentService.getAvailableOwnerships(
      this.new_incident.branch_id, date, this.new_incident.type.id)
      .subscribe((result : Result<LightIncident[]>) => {
          this.available_ownerships = result.data;

          if(result.data
            && result.data.length == 1
            && this.new_incident
            && this.new_incident.add_to_ownernership == 2) {
            this.new_incident.ownership = result.data[0];
          }
      });
  }

  register_new_incident(close_action) {
    this.validate_new_event();
    if(!this.new_incident.correct)
      return;

    this.saving = true;
    this.incidentService.register_new_incident(this.new_incident).pipe(
      tap((next) => this.reset_new_incident()))
      .subscribe((result) => {
        this.saving = false;
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
    let location = null;
    if(this.branches
      && this.locations
      && !initial_state.location && initial_state.branch_id > 0) {
      let branch = this.branches.find(b => b.id == initial_state.branch_id);
      location = this.locations.find(l => l.id == branch.location_id);
      console.log('a');
    }
    console.log(location);

    this.new_incident = {
      branch_id: initial_state.branch_id,
      people: initial_state.people || [],
      location: location,
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

    if(initial_state.ownership) {
      this.lock_ownership = true;
      this.new_incident.add_to_ownernership = 2;
      this.available_ownerships = [ initial_state.ownership ];
      this.new_incident.ownership = initial_state.ownership;
      this.new_incident.location = { id : initial_state.ownership.location_id };

      console.log(this.new_incident.location);
      console.log(initial_state.ownership);
    }
  }

}
