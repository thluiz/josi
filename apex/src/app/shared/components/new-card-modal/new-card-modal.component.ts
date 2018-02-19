import { CardService } from './../../../services/card-service';
import { UtilsService } from 'app/services/utils-service';
import { ModalType } from './../../../services/modal-service';
import { ModalService } from 'app/services/modal-service';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import { ParameterService } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { IncidentService } from 'app/services/incident-service';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { debounceTime } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';

import { Card } from 'app/shared/models/card.model';

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
    this.type = initial_state.card_type || CardType.Task;
    
    Observable.zip(
      this.cardService.getOrganizations(true),                  
      this.parameterService.getCardTemplates(),
      this.cardService.getOperators(),
      (organizations : any[], templates : any[], operators: any[]) => {        
        this.organizations = organizations;        
        this.templates = templates.filter(t => !t.automatically_generated 
                                          && t.active
                                          && t.is_task == (this.type ==  CardType.Task || this.type == CardType.ProjectTask))
                                  .map((template) => {
                                    let transformed = template;
                                    transformed.name = transformed.name.replace('Projeto - ', '')
                                    return transformed;
                                  });    

        this.operators = operators;

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
    console.log(this.card);
    this.cardService.saveCard(this.card).subscribe((data) => {
      console.log(data);
      if(this.modalRef) {
        this.modalRef.close(data);
      }
    });
  }

  entity_compare(p1, p2) {
    return p1 != null && p2 != null && p1.id == p2.id
  }

  private reset_card(initial_state :Card){   
    this.card = initial_state;
    
    if(!this.card.template_id && this.templates && this.templates.length > 0) {
      this.card.template_id = this.templates[0].id;
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