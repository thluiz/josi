import { ToastrService } from 'ngx-toastr';

import { zip as observableZip,  Observable ,  Subscription } from 'rxjs';

import { filter } from 'rxjs/operators';
import { PersonRelationshipListComponent } from './../../../shared/components/person-relationship-list/person-relationship-list.component';
import { PersonCommentListComponent } from './../shared/components/person-comment-list/person-comment-list.component';
import { PersonPartnershipListComponent } from './../shared/components/person-partnership-list/person-partnership-list.component';
import { PersonContactListComponent } from './../shared/components/person-contact-list/person-contact-list.component';
import { PersonExternalUnitListComponent } from './../shared/components/person-external-unit-list/person-external-unit-list.component';
import { PersonIncidentHistoryListComponent } from './../../../shared/components/person-incident-history-list/person-incident-history-list.component';

import { CardService } from 'app/services/card-service';

import { Component, Input, AfterViewInit, QueryList, OnInit, OnDestroy, ViewChildren   }
from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

import { PersonService, ActivityType } from './../../../services/person-service';
import { ParameterService } from './../../../services/parameter-service';

import { FormControl, FormsModule, ReactiveFormsModule,
  FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbModal,
ModalDismissReasons,
NgbActiveModal,
NgbDateParserFormatter,
NgbDatepickerI18n,
NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { PersonIndicationListComponent } from '../../../shared/components/person-indication-list/person-indication-list.component';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['../people-customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter},
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class PersonPageComponent implements OnInit, OnDestroy {

  @ViewChildren(PersonIndicationListComponent)
  indicationsComponent : QueryList<PersonIndicationListComponent>;

  @ViewChildren(PersonExternalUnitListComponent)
  externalUnitsComponent : QueryList<PersonExternalUnitListComponent>;

  @ViewChildren(PersonContactListComponent)
  contactListComponent : QueryList<PersonContactListComponent>;

  @ViewChildren(PersonPartnershipListComponent)
  partnershipComponent : QueryList<PersonPartnershipListComponent>;

  @ViewChildren(PersonCommentListComponent)
  commentListComponent : QueryList<PersonCommentListComponent>;

  @ViewChildren(PersonRelationshipListComponent)
  relationShipListComponent : QueryList<PersonRelationshipListComponent>;

  @ViewChildren(PersonIncidentHistoryListComponent)
  historyListComponent : QueryList<PersonIncidentHistoryListComponent>;

  id: number;
  person: any;
  current_roles;
  available_roles;
  current_scheduling = [];
  comments: any[];
  new_role: any;
  new_schedule: any = {};
  manual;
  manual_incident_types;
  recurrence_types;
  branches = [];
  all_locations = [];
  locations = [];
  countries = [];
  addresses = [];
  new_address: any;
  sub_components_loaded = false;
  financial_history = [];
  trainning_history = [];
  contact_history = [];

  private subs: Subscription[];

  constructor(private personService: PersonService,
              private parameterService: ParameterService,
              private cardService: CardService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private toastrService: ToastrService,
              private datePickerConfig: NgbDatepickerConfig) {
  }

  ngAfterViewInit() {
    this.sub_components_loaded = true;
  }

  private loadSubComponents() {
    if(!this.subs) {
      this.subs = [];
    }

    this.subs.push(this.indicationsComponent.changes.subscribe((comps: QueryList <PersonIndicationListComponent>) => {
      if(comps.first) comps.first.load_indications();
    }));

    this.subs.push(this.externalUnitsComponent.changes.subscribe((comps: QueryList <PersonExternalUnitListComponent>) => {
      if(comps.first) comps.first.load_items();
    }));

    this.subs.push(this.partnershipComponent.changes.subscribe((comps: QueryList <PersonPartnershipListComponent>) => {
      if(comps.first) comps.first.load_items();
    }));

    this.subs.push(this.contactListComponent.changes.subscribe((comps: QueryList <PersonContactListComponent>) => {
      if(comps.first) comps.first.load_contacts();
    }));

    this.subs.push(this.commentListComponent.changes.subscribe((comps: QueryList <PersonCommentListComponent>) => {
      if(comps.first) comps.first.load_comments();
    }));

    this.subs.push(this.relationShipListComponent.changes.subscribe((comps: QueryList <PersonRelationshipListComponent>) => {
      if(comps.first) comps.first.load_items();
    }));

    this.subs.push(this.historyListComponent.changes.subscribe((comps: QueryList <PersonIncidentHistoryListComponent>) => {
      if(comps.first) {
        comps.first.set_dates_from_date(new Date());
        comps.first.load_items();
      }
    }));
  }

  ngOnInit() {
    if(!this.subs) {
      this.subs = [];
    }

    this.subs.push(this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.reloadData();
    }));

    this.subs.push(this.personService.personChanges$.pipe(
    filter((data) => data != null && data.id == this.id))
    .subscribe((data) => {
      this.person = data;
    }));

    this.reset_new_schedule();
  }

  ngOnDestroy() {
    this.unsubscribeAll();
  }

  changePerson(person_id) {
    this.id = person_id;
    this.reloadData();
    this.router.navigateByUrl("/people/person/" + person_id);
  }

  private reloadData() {
    if(this.sub_components_loaded) {
      this.loadSubComponents();
    }

    this.load_person_data();
    this.load_person_roles();
    this.load_person_scheduling();
    this.load_person_address();
  }

  private unsubscribeAll() {
    if(this.subs) {
      this.subs.forEach(s => s.unsubscribe());
    }
  }

  filter_locations() {
    if(this.new_schedule.branch_id == 0) {
      this.locations = [];
    } else if(this.new_schedule.branch_id == -1) {
      this.locations = this.all_locations.filter(l => !l.branch)
    } else if(this.new_schedule.branch_id > 0) {
      this.locations = this.all_locations.filter(l => l.branch && l.branch.id == this.new_schedule.branch_id);
    }

    if(this.locations.length == 1) {
      this.new_schedule.location_id = this.locations[0].id;
    }

    if(this.locations.length > 0 && this.new_schedule.branch_id > 0) {
      const branch = this.branches.find(b => b.id == this.new_schedule.branch_id);
      this.new_schedule.location_id = branch.location_id;
    }
  }

  open_schedule_modal(content) {
    observableZip(this.parameterService.getActiveBranches(),
                    this.parameterService.getIncidentTypes(),
                    this.parameterService.getRecurrenceTypes(),
                    this.parameterService.getActiveLocations(),
      (result_branches, result_incident_types, result_recurrence_types, result_locations) => {
        this.branches = result_branches.data;
        this.manual_incident_types = result_incident_types.data.filter(f => !f.automatically_generated);
        this.recurrence_types = result_recurrence_types.data;
        this.all_locations = result_locations.data;
      }).subscribe(() => {
        this.open(content);
      });
  }

  open_add_role(content){
    this.parameterService.getRoles().subscribe((result_roles) => {
      this.available_roles = result_roles.data
                            .filter(r => !this.current_roles
                                  || this.current_roles.findIndex(cr => cr.id == r.id) < 0
                            );

      this.open(content);
    });
  }

  private open(content){
    this.modalService.open(content).result.then(() => {

    }, (reason) => {
        console.log(reason);
    });

  }

  add_role() {
    this.personService
    .addRole(this.id, this.new_role)
    .toPromise().then(() => {
      this.load_person_data();
      this.load_person_roles();
      this.cardService.getOperators(true).subscribe();
    });
  }

  remove_role(role_id) {
    this.personService
    .removeRole(this.id, role_id)
    .toPromise().then(() => {
      this.load_person_data();
      this.load_person_roles();
      this.cardService.getOperators(true).subscribe();
    });
  }

  load_person_scheduling() {
    this.personService
    .getPersonScheduling(this.id)
    .subscribe((result_scheduling : Result<any>) => {
      this.current_scheduling = result_scheduling.data;
    });
  }

  load_person_roles() {
    this.personService
    .getPersonRoles(this.id)
    .subscribe((result_roles: Result<any[]>) => {
      this.current_roles = result_roles.data;
    });
  }

  load_person_data() {
    this.personService
    .getData(this.id)
    .subscribe((result_data: Result<any>) => {
      this.person = result_data.data[0];
    });
  }

  begin_remove_schedule(schedule) {
    schedule.begin_remove = true;
  }

  rollback_remove_schedule(schedule) {
    schedule.begin_remove = false;
  }

  remove_schedule(schedule) {
    this.personService
    .remove_schedule(schedule)
    .toPromise()
    .then(() => {
      this.load_person_scheduling();
    });
  }

  save_schedule(close_action) {
    let start_date = this.new_schedule.start_date_tmp;
    if(start_date) {
      this.new_schedule.start_date = `${start_date.year}-${start_date.month}-${start_date.day}`;
    }

    if(this.new_schedule.time) {
      this.new_schedule.start_hour = this.new_schedule.time.hour;
      this.new_schedule.start_minute = this.new_schedule.time.minute;
    }

    if(this.new_schedule.type) {
      this.new_schedule.incident_type = this.new_schedule.type.id;
    }

    if(this.new_schedule.branch_id == 0) {
      this.toastrService.error("Defina o núcleo ou organização");
      return;
    }

    if(this.new_schedule.type.financial_type == 0 && this.new_schedule.location_id <= 0) {
      this.toastrService.error("Defina o local da atividade");
      return;
    }

    this.personService
    .save_schedule(this.new_schedule)
    .subscribe((result_data : Result<any>) => {
      if(!result_data.success) {
        this.toastrService.error(result_data.message);
        return;
      }
      this.load_person_scheduling();
      this.reset_new_schedule();
      close_action();
    });
  }

  reset_new_schedule() {
    this.new_schedule = {
      person_id: this.id,
      branch_id: 0
    };
  }

  reset_new_schedule_type(){
    this.new_schedule.type = null;
    this.new_schedule.tmp_combo_type = null;
    this.new_schedule.tmp_type = null;
    this.new_schedule.children_type = null;
    this.validate_new_schedule();
  }

  change_new_schedule_type(tp) {
    const t = this.manual_incident_types.filter(t => t.id == tp);
    if(t.length != 1) {
      return;
    }
    const type = t[0];

    if(type.childrens != null) {
      this.new_schedule.type = null;
      this.new_schedule.tmp_type = type;
      this.new_schedule.correct = false;
    } else {
      this.new_schedule.tmp_type = type;
      this.new_schedule.type = type;
    }
  }

  change_new_schedule_children_type(tp) {
    const t = this.new_schedule.tmp_type.childrens.filter(t => t.id == tp);
    if(t.length != 1) {
      return;
    }
    const type = t[0];
    this.new_schedule.children_type = type;
    this.new_schedule.type = type;
  }

  validate_new_schedule() {
    this.new_schedule.correct = false;
    let schedule = this.new_schedule;

    if(parseInt(schedule.number_of_incidents, 10) > 108) {
      this.toastrService.error("A quantidade máxima de eventos é 108")
      return;
    }

    if(parseInt(schedule.person_id, 10) > 0
      && parseInt(schedule.branch_id, 10) != 0
      && schedule.type != null
      && parseInt(schedule.recurrence_type, 10) > 0
      && parseInt(schedule.number_of_incidents, 10) > 0
      && schedule.start_date_tmp != null) {
        if(schedule.type.need_value
          && (!schedule.value || schedule.value <= 0)) {
          return;
        }

        if(schedule.type.need_start_hour_minute && !schedule.time) {
          return;
        }

        this.new_schedule.correct = true;
      }


  }



  validate_new_schedule_value() {
    if(parseFloat(this.new_schedule.value) != NaN) {
      this.validate_new_schedule();
      return;
    }
    this.new_schedule.value = 0;
    this.validate_new_schedule();
  }

  /**
   * COMMENTS
   */
  load_comments_about_person() {
    this.personService.getCommentsAboutPerson(this.id).subscribe((result_comments : Result<any[]>) => {
      this.comments = result_comments.data;
    });
  }

  /**
   * ADDRESS
   */

  load_person_address() {
    this.personService.getAddresses(this.id).subscribe((result_data: Result<any[]>) => {
      this.addresses = result_data.data;
    });
  }

  open_address_modal(content) {
    this.new_address = {
      country_id: 1,
      city: 'Rio de Janeiro',
      state: 'Rio de Janeiro',
      person_id: this.id
    };
    observableZip(this.parameterService.getCountries(),
      (result_countries : Result<any[]>) => {
        this.countries = result_countries.data;
      }).subscribe(() => {
        this.open(content);
      });
  }

  validate_new_address() {
    let errors = [];
    if(!this.new_address.country_id || this.new_address.country_id <= 0) {
      errors[errors.length] = "Selecione o país";
    }

    if(!this.new_address.state || this.new_address.state.length < 3) {
      errors[errors.length] = "Informe o estado";
    }

    if(!this.new_address.city || this.new_address.city.length < 3) {
      errors[errors.length] = "Informe a cidade";
    }

    if(!this.new_address.street || this.new_address.street.length < 3) {
      errors[errors.length] = "Informe a Rua";
    }

    this.new_address.correct = errors.length == 0;
    this.new_address.errors = errors;
  }

  save_address() {
    this.new_address.saving = true;
    this.personService
    .saveAddress(this.new_address)
    .subscribe(() => {
      this.new_address.saving = false;
      this.load_person_address();
    });
  }

  remove_address(ad) {
    this.personService
    .archiveAddress(ad)
    .subscribe(() => {
      this.load_person_address();
    });
  }

}
