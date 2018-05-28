
import {zip as observableZip,  Subscription, Observable } from 'rxjs';

import {filter} from 'rxjs/operators';
import { CardService } from 'app/services/card-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { SecurityService } from 'app/services/security-service';
import { ParameterService, Configurations } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'person-partnership-list',
  templateUrl: './person-partnership-list.component.html',
  styleUrls: ['../../../../../../assets/customizations.scss']
})
export class PersonPartnershipListComponent implements OnInit, OnDestroy { 

  items: any[];   

  @Input() d:any;
  @Input() person:any;
  @Input() showHeader = true; 
  saving = false;    
  new_item = { name: "",     
    valid: false,
    comment: "",
    person_id: 0,
    branch_id: 0,
    operator_id: 0,
    indication_contact_type: 0
  };
  
  branches: any[];
  operators: any[];
  errors :string[] = [];
  
  private changes_subscriber: Subscription;
  private last_call : Date;

  constructor(private modalService: NgbModal, 
    private parameterService: ParameterService, 
    private securityService: SecurityService,  
    private cardService: CardService,
    private personService: PersonService) {   

  }

  ngOnInit() {      
    
    this.changes_subscriber = this.personService.partnershipChanges$.pipe(
      filter((data) => data != null && data.person_id == this.person.id))
      .subscribe((data) => {            
        this.load_items();      
      });
    
    this.load_items();
  }

  ngOnDestroy() {
    this.changes_subscriber.unsubscribe();
  }

  load_items() {    
    if(this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents()))  {
      return;
    }

    this.personService.getPersonPartnerships(this.person.id)
    .subscribe((data : any) => {       
      this.items = data;
    });

    this.last_call = new Date();
  }
       
  open(content){  
    this.saving = false;

    this.new_item = { name: "",       
      valid: false,
      comment: "",
      person_id: this.person.id,
      branch_id: this.person.branch_id,
      operator_id: 0,
      indication_contact_type: 0
    };  

    observableZip(
      this.securityService.getCurrentUserData(),      
      this.parameterService.getActiveBranches(),
      this.cardService.getOperators(),
      (user, branches, operators) => {        
        this.new_item.operator_id = user.person_id;                
        this.branches = branches;
        this.operators = operators; 

        this.modalService.open(content).result.then((result) => {                                  
  
        }, (reason) => {
          console.log(reason);
        }); 
      }  
    ).subscribe(); 
  } 

  save_new_item(close_action) {
    this.saving = true;

    this.personService.savePartnership(this.new_item).subscribe((data) => {
      this.saving = false;

      if(close_action) {
        close_action();
      }
    });
  } 

  validate_new_item() {
    this.errors = [];
    if(!this.new_item) {
      return;
    }

    if(!this.new_item.name || this.new_item.name.length < 3) {
      this.errors.push("Informe o nome da empresa para parceria");
    }

    if(this.new_item.branch_id <= 0) {
      this.errors.push("Informe o núcleo responsável pela indicação");
    }

    if(this.new_item.operator_id <= 0) {
      this.errors.push("Informe o operador responsável pela indicação");
    }

    this.new_item.valid = this.errors.length <= 0;
  }
}