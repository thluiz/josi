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

@Component({
  selector: 'new-person-modal',
  templateUrl: './new-person-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})

export class NewPersonModalComponent implements OnInit {    
  branches = [];
  incident_types = [];  
  roles = [];
  person : any = {};  
  modalRef : NgbModalRef;
  saving = false;

  @ViewChild('add_person_modal') add_person_modal: ElementRef;

  constructor(
    private datePickerConfig: NgbDatepickerConfig,          
    private ngbModalService: NgbModal,
    private personService: PersonService, 
    private incidentService: IncidentService,
    private parameterService: ParameterService,
    private modalService: ModalService,
    private utilsService: UtilsService
  ) {
   
      datePickerConfig.firstDayOfWeek = 7
  }

  ngOnInit() {
    this.reset_person({});        
  }  

  open(initial_state = {}) {   
    this.saving = false;
    this.reset_person(initial_state);
    Observable.zip(
      this.parameterService.getActiveBranches(),      
      this.parameterService.getRoles(), 
      this.parameterService.getIncidentTypes(),     
      (branches, roles, incident_types : any[]) => {
        this.branches = branches;
        this.roles = roles.filter(r => r.allowed_for_new_person);
        this.incident_types = incident_types.filter(i => i.allowed_for_new_person);

        this.open_modal(this.add_person_modal, true);        
      }
    ).subscribe();                   
  }

  validate_new_person() {
    this.person.is_valid = true;
    this.person.validation = [];

    if(!this.person.branch_id || +this.person.branch_id <= 0) {
      this.person.is_valid = false;
      this.person.validation[this.person.validation] = "Defina o núcleo";
    }

    if(!this.person.role_id || +this.person.role_id <= 0) {
      this.person.is_valid = false;
      this.person.validation[this.person.validation.length] = "Defina o tipo de cadastro";
    }

    if(!this.person.name || this.person.name.length <= 5) {
      this.person.is_valid = false;
      this.person.validation[this.person.validation.length] = "Informe o nome da pessoa";
    }

    if(!this.person.initial_contact || this.person.initial_contact.length <= 5) {
      this.person.is_valid = false;
      this.person.validation[this.person.validation.length] = "Informe como foi o contato inicial";
    }    

    if(this.person.role_id == 4) {
      if(!this.person.next_incident_type || this.person.next_incident_type <= 0) {
        this.person.is_valid = false;
        this.person.validation[this.person.validation.length] = "Qual a próxima atividade da pessoa?";
      } else {
        if(!this.person.next_incident_dt) {
          this.person.is_valid = false;
          this.person.validation[this.person.validation.length] = "Informe a data da atividade";
        }

        if(!this.person.next_incident_time) {
          this.person.is_valid = false;
          this.person.validation[this.person.validation.length] = "Informe o horário da atividade";
        }
      }
    }
  }

  register_new_person() {
    this.saving = true;
    this.person.birth_date = this.utilsService.translate_date_to_server(this.person.birth_date_tmp);
    this.person.next_incident_date = this.utilsService.translate_date_time_to_server(
      this.person.next_incident_dt, this.person.next_incident_time
    );

    this.personService.registerPerson(this.person).subscribe((data) => {            
      this.modalRef.close(data);      
      this.saving = false;
      this.modalService.open(ModalType.PersonTreatment, data);
    });
  }

  private reset_person(initial_state :any = {}){
    let date = new Date();
    this.person = {
      branch_id: initial_state.branch_id,
      next_incident_dt: {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      }
    };
  }

  private open_modal(content, on_close_action = false) {
    this.modalRef = this.ngbModalService.open(content);

    this.modalRef.result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }   
}