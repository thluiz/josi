
import {zip as observableZip,  Observable ,  of } from 'rxjs';
import { CardService } from './../../../services/card-service';
import { UtilsService } from 'app/services/utils-service';
import { ModalType } from './../../../services/modal-service';
import { ModalService } from 'app/services/modal-service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import { ParameterService } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { IncidentService } from 'app/services/incident-service';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { debounceTime ,  delay ,  map ,  distinctUntilChanged ,  catchError ,  tap ,  switchMap } from 'rxjs/operators';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { Card } from 'app/shared/models/card.model';
import { Group } from 'app/shared/models/group.model';
import { Location } from 'app/shared/models/location.model';

export enum CardType {
  Task,
  Project,
  ProjectTask
}

@Component({
  selector: 'new-card-modal',
  templateUrl: './new-card-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class NewCardModalComponent implements OnInit {    
  organizations = [];
  incident_types = [];  
  roles = [];
  person : any = {};  
  card : Card;  
  templates = []; 
  modalRef : NgbModalRef;
  type: CardType = CardType.Task;
  types = CardType; 
  card_is_valid = false;
  card_validation: string[];
  operators: any[];
  search_failed = false;
  searching_people = false;
  groups: Group[];
  branches: any[];
  locations: Location[];
  saving = false;

  @ViewChild('add_card_modal') add_card_modal: ElementRef;

  constructor(
    private datePickerConfig: NgbDatepickerConfig,          
    private ngbModalService: NgbModal,
    private personService: PersonService, 
    private cardService: CardService,
    private parameterService: ParameterService,
    private modalService: ModalService,
    private utilsService: UtilsService
  ) {   
      datePickerConfig.firstDayOfWeek = 7
  }

  ngOnInit() {
    this.reset_card({} as Card);        
  }  

  open(initial_state :any = {}) { 
    this.saving = false;      
    this.type = initial_state.card_type || CardType.Task;    

    observableZip(
      this.cardService.getOrganizations(true),                  
      this.parameterService.getCardTemplates(),
      this.cardService.getOperators(),
      this.parameterService.getGroups(),
      this.parameterService.getActiveBranches(),
      this.parameterService.getLocations(),
      (organizations : any[], templates : any[], operators: any[], 
        groups: Group[], branches: any[], locations: Location[]) => {        
        this.organizations = organizations;        
        this.locations = locations;
        this.operators = operators;
        this.groups = groups;
        this.branches = branches;

        this.templates = templates.filter(t => !t.automatically_generated 
                                          && t.active
                                          && t.is_task == (this.type ==  CardType.Task || this.type == CardType.ProjectTask))
                                  .map((template) => {
                                    let transformed = template;
                                    transformed.name = transformed.name.replace('Projeto - ', '')
                                    return transformed;
                                  });            

        this.reset_card(initial_state);
        this.open_modal(this.add_card_modal, true);        
      }
    ).subscribe();                   
  }

  validate_new_card() {
    this.card_is_valid = true;
    this.card_validation = [];

    if(!this.card.parent) {
      this.card_is_valid = false;
      this.card_validation[this.card_validation.length] =  "Informe a organização";
    }

    if(!this.card.leaders) {
      this.card_is_valid = false;
      this.card_validation[this.card_validation.length] =  "Informe o responsável";
    }

    if(this.card.template) {
      if(this.card.template.require_target && (!this.card.people || this.card.people.length == 0)) {
        this.card_is_valid = false;
        this.card_validation[this.card_validation.length] =  "Informe o interlocutor da tarefa";
      }

      if(this.card.template.require_target_group && !this.card.group) {
        this.card_is_valid = false;
        this.card_validation[this.card_validation.length] =  "Informe o grupo para gerar as tarefas";
      }

      if(this.card.group && !this.card.branch && !this.card.group.allow_no_branch) {
        this.card_is_valid = false;
        this.card_validation[this.card_validation.length] =  "Informe o subgrupo para gerar as tarefas";
      }
    }

    if(!this.card.title || this.card.title.length <= 5) {
      this.card_is_valid = false;
      this.card_validation[this.card_validation.length] =  "Informe o título";
    }

    if(this.type == CardType.Project) {

    }
  }

  register_new_person() {
    this.person.birth_date = this.utilsService.translate_date_to_server(this.person.birth_date_tmp);
    this.person.next_incident_date = this.utilsService.translate_date_time_to_server(
      this.person.next_incident_dt, this.person.next_incident_time
    );

    this.personService.registerPerson(this.person).subscribe((data) => {      
      this.modalRef.close(data);      
      this.modalService.open(ModalType.PersonTreatment, data);
    });
  }

  register_new_card() {
    this.saving = true;
    if(!this.card.template.require_target) {
      this.card.people = null;
    }
    
    this.cardService.saveCard(this.card).subscribe((data) => {
      this.saving = false;
      if(this.modalRef) {
        this.modalRef.close(data);
      }
    });
  }

  entity_compare(p1, p2) {
    return p1 != null && p2 != null && p1.id == p2.id
  }

  remove_person_from_new_card(person) {
    this.card.people = this.card.people.filter(p => p.person_id != person.person_id);            
    this.validate_new_card();
  }

  search_people = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching_people = true),
      switchMap(term =>
        this.personService.search(term).pipe(
          map(response =>  {             
            return <string[]>response; 
          }),
          tap(() => this.search_failed = false),
          catchError(() => {
            this.search_failed = true;
            return of([]);
          }),)),
      tap(() => this.searching_people = false),)

  people_typeahead_formatter = (x) => x.name;

  add_person_to_new_card(event) {    
    if(!event.name) {
      return;
    }

    if(!this.card.people) {
      this.card.people = [];
    }

    this.card.people.push(event);
    this.card.tmp_person = "";
    this.validate_new_card();
  }

  private reset_card(initial_state :Card){   
    this.card = initial_state;
    
    if(initial_state && initial_state.parent != null && initial_state.parent.leaders && initial_state.parent.leaders.length > 0) {
      this.card.leaders = initial_state.parent.leaders[0];
    }

    if(!this.card.template && this.templates && this.templates.length > 0) {
      this.card.template = this.templates[0];
    }

    if(!this.card.locations && this.locations && this.locations.length > 0) {
      this.card.locations = []
      this.card.locations[0] = this.locations[0];

      if(initial_state && initial_state.parent != null && initial_state.parent.locations && initial_state.parent.locations.length > 0) {
        this.card.locations[0] = initial_state.parent.locations[0];
      }
    }
    
    this.validate_new_card();
  }

  private open_modal(content, on_close_action = false) {
    this.modalRef = this.ngbModalService.open(content);

    this.modalRef.result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }   
}