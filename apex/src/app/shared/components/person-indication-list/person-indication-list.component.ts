
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ParameterService, Configurations } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'person-indication-list',
  templateUrl: './person-indication-list.component.html',
  styleUrls: ['../../../../assets/customizations.scss']
})
export class PersonIndicationListComponent implements OnInit, OnDestroy { 

  indications: any[];   

  @Input() d:any;
  @Input() person:any;
  @Input() showHeader = true; 
  saving = false;  
  needed_indications = 0; 
  new_indication = { name: "", 
    contact_type1: 0,
    contact1: "",
    contact_type2: 0,
    contact2: "",
    contact_type3: 0,
    contact3: "",
    valid: false,
    comment: "",
    person_id: 0
  };
  contact_types: any[];
  errors :string[] = [];
  
  private indication_changes_subscriber: Subscription;

  constructor(private modalService: NgbModal, 
    private parameterService: ParameterService,    
    private personService: PersonService) {   

  }

  ngOnInit() {      
    
    this.indication_changes_subscriber = this.personService.indicationChanges$
      .filter((data) => data != null && data.person_id == this.person.id)
      .subscribe((data) => {            
        this.load_indications();      
      });
    
    this.load_indications();
  }

  ngOnDestroy() {
    this.indication_changes_subscriber.unsubscribe();
  }

  load_indications() {    
    this.personService.getPersonIndications(this.person.id)
    .subscribe((data : any) => { 

      this.parameterService.getConfigurations().subscribe((configs: any[]) => {        
        var minimal = configs.find(d => d.id == Configurations.MinimalIndicationsPerActiveMember.toFixed());  

        if(minimal.value > 0) {
          this.needed_indications = minimal.value - data.length;
        }
      });

      this.indications = data;
    });
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
      person_id: this.person.id
    };  

    this.parameterService.getContactTypes().subscribe((data) => {  
      this.contact_types = data;

      this.modalService.open(content).result.then((result) => {                                  

      }, (reason) => {
        console.log(reason);
      });                
    });    
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