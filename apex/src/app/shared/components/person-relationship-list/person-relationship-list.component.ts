
import {zip as observableZip,  Subscription, Observable } from 'rxjs';

import {filter} from 'rxjs/operators';
import { CardService } from 'app/services/card-service';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { SecurityService } from 'app/services/security-service';
import { ParameterService, Configurations } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'person-relationship-list',
  templateUrl: './person-relationship-list.component.html',
  styleUrls: ['../../../../assets/customizations.scss']
})
export class PersonRelationshipListComponent implements OnInit, OnDestroy { 

  items: any[];   

  @Input() d:any;
  @Input() person:any;
  @Input() showHeader = true;   
  @Input() navigateToRelationship = false;
  @Output() onNavigateToRelationship = new EventEmitter<boolean>();

  saving = false;  
  needed_direct_indications = 0; 
  needed_indirect_indications = 0; 
  new_indication = { name: "", 
    contact_type1: 0,
    contact1: "",
    contact_type2: 0,
    contact2: "",
    contact_type3: 0,
    contact3: "",
    valid: false,
    comment: "",
    person_id: 0,
    branch_id: 0,
    operator_id: 0,
    indication_contact_type: 0,
    occupation: '',
    district: '',
    age: ''
  };
  contact_types: any[];
  branches: any[];
  operators: any[];
  errors :string[] = [];
  private last_call : Date;
  
  private indication_changes_subscriber: Subscription;

  constructor(private modalService: NgbModal, 
    private parameterService: ParameterService, 
    private securityService: SecurityService,  
    private cardService: CardService,
    private personService: PersonService) {   

  }

  ngOnInit() {      
    
    this.indication_changes_subscriber = this.personService.indicationChanges$.pipe(
      filter((data) => data != null && data.person_id == this.person.id))
      .subscribe((data) => {            
        this.load_items();      
      });
    
    this.load_items();
  }

  ngOnDestroy() {
    this.indication_changes_subscriber.unsubscribe();
  }

  navigateToPerson(person_id) {
    this.person.id = person_id;
    this.load_items();
    this.onNavigateToRelationship.emit(person_id);
  }

  load_items() {    
    if(this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents()))  {
      return;
    }
    
    this.personService.getPersonRelationships(this.person.id)
    .subscribe((result : any) => { 
      this.items = result.data;
    });

    this.last_call = new Date();
  }
       
  open(content){  
    this.saving = false;

    this.new_indication = { name: "", 
      contact_type1: 0,
      contact1: "",
      contact_type2: 0,
      contact2: "",
      contact_type3: 0,
      contact3: "",
      valid: false,
      comment: "",
      person_id: this.person.id,
      branch_id: this.person.branch_id,
      operator_id: 0,
      indication_contact_type: 0,
      occupation: '',
      district: '',
      age: ''
    };  

    observableZip(
      this.securityService.getCurrentUserData(),
      this.parameterService.getContactTypes(),
      this.parameterService.getActiveBranches(),
      this.cardService.getOperators(),
      (user, contact_types, branches, operators) => {        
        this.new_indication.operator_id = user.person_id;        
        this.contact_types = contact_types;
        this.branches = branches;
        this.operators = operators; 

        this.modalService.open(content).result.then((result) => {                                  
  
        }, (reason) => {
          console.log(reason);
        }); 
      }  
    ).subscribe(); 
  } 

  save_new_indication(close_action) {
    this.saving = true;

    this.personService.saveIndication(this.new_indication).subscribe((data) => {
      this.saving = false;

      if(close_action) {
        close_action();
      }
    });
  } 

  remove_indication(indication) {

  }

  validate_new_indication() {
    this.errors = [];
    if(!this.new_indication) {
      return;
    }

    if(!this.new_indication.name || this.new_indication.name.length < 3) {
      this.errors.push("Informe o nome da pessoa");
    }

    if(!this.new_indication.district || this.new_indication.district.length < 3) {
      this.errors.push("Informe o bairro da pessoa");
    }

    if(!this.new_indication.occupation || this.new_indication.occupation.length < 3) {
      this.errors.push("Informe a profissão da pessoa");
    }

    if(this.new_indication.branch_id <= 0) {
      this.errors.push("Informe o núcleo para indicação");
    }

    if(this.new_indication.operator_id <= 0) {
      this.errors.push("Informe o operador responsável para indicação");
    }

    if((!this.new_indication.contact1 || this.new_indication.contact1.length < 3)
     && (!this.new_indication.contact2 || this.new_indication.contact2.length < 3)
     && (!this.new_indication.contact3 || this.new_indication.contact3.length < 3))  {
      this.errors.push("Informe ao menos o contato principal da pessoa");
    }

    if(this.new_indication.contact1 
        && this.new_indication.contact1.length >= 3
        && this.new_indication.contact_type1 <= 0)  {
      this.errors.push("Informe o tipo do primeiro contato");
    }

    if(this.new_indication.contact2 
      && this.new_indication.contact2.length >= 3
      && this.new_indication.contact_type2 <= 0)  {
      this.errors.push("Informe o tipo do segundo contato");
    }

    if(this.new_indication.contact3 
      && this.new_indication.contact3.length >= 3
      && this.new_indication.contact_type3 <= 0)  {
      this.errors.push("Informe o tipo do terceiro contato");
    }

    this.new_indication.valid = this.errors.length <= 0;
  }
}