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


export enum CardType {
  Task,
  Project
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
  card : any = {};  
  templates = []; 
  modalRef : NgbModalRef;
  type: CardType = CardType.Task;
  types = CardType; 

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
    this.reset_card({});        
  }  

  open(initial_state :any = {}) {       
    this.type = initial_state.card_type || CardType.Task;
    
    Observable.zip(
      this.cardService.getOrganizations(true),                  
      this.parameterService.getCardTemplates(),
      (organizations : any[], templates : any[]) => {        
        this.organizations = organizations;        
        this.templates = templates.filter(t => !t.automatically_generated 
                                          && t.active
                                          && t.is_task == (this.type ==  CardType.Task))
                                  .map((template) => {
                                    let transformed = template;
                                    transformed.title = transformed.title.replace('Projeto - ', '')
                                    return transformed; // ;
                                  });        

        if(!initial_state.template_id) {
          initial_state.template_id = this.templates[0].id;
        }

        this.reset_card(initial_state);
        this.open_modal(this.add_card_modal, true);        
      }
    ).subscribe();                   
  }

  validate_new_card() {
    this.card.is_valid = true;
    this.card.validation = [];

    if(!this.card.organization_id || this.card.organization_id <= 0) {
      this.card.is_valid = false;
      this.card.validation[this.card.validation.length] =  "Informe a organização";
    }

    if(!this.card.title || this.card.title.length <= 5) {
      this.card.is_valid = false;
      this.card.validation[this.card.validation.length] =  "Informe o título";
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

  filter_possible_projects() {

  }


  private reset_card(initial_state :any = {}){
    let date = new Date();
    
    let organization_id = initial_state.organization_id; 
    
    if(initial_state.organization) {
      organization_id = initial_state.organization.id;
    }

    this.card = {
      organization_id: organization_id,
      organization: initial_state.organization || { childrens: [] },
      operator_id: initial_state.operator_id || 0,
      possible_projects: initial_state.possible_projects || []         
    };

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