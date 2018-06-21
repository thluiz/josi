
import {zip as observableZip,  Subscription, Observable ,  of } from 'rxjs';
import { debounceTime ,  delay ,  map ,  distinctUntilChanged ,  catchError ,  tap ,  switchMap } from 'rxjs/operators';

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
  new_relationship: any;
  relationship_types  = [];
  
  errors :string[] = [];
  private last_call : Date;
  
  private indication_changes_subscriber: Subscription;

  constructor(private modalService: NgbModal, 
    private parameterService: ParameterService, 
    private securityService: SecurityService,  
    private cardService: CardService,
    private personService: PersonService) {   
    this.setup_new_relationship();
  }

  search_person;
  searching_people;
  search_failed;
  people_typeahead_formatter = (x) => x.name;

  add_person(event) {    
    this.new_relationship.person2 = event;
    this.validate_relationship();
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
    this.setup_new_relationship();
    this.parameterService.getRelationshipTypes().subscribe(result => {
      
      this.relationship_types = result;

      this.modalService.open(content).result.then((result2) => {                                  
    
      }, (reason) => {
        console.log(reason);
      });
    });

  } 

  save_new_indication(close_action) {
    this.saving = true;

    /*this.personService.saveRelationship(this.new_relationship)
    .subscribe((data) => {
      this.saving = false;

      if(close_action) {
        close_action();
      }
    });*/
  } 

  remove_relationship(indication) {

  }

  validate_relationship() {
    this.errors = [];
    if(!this.new_relationship) {
      return;
    }    

    if(!this.new_relationship.relationship_type) {
      this.errors.push("Defina o tipo de relacionamento");
      this.new_relationship.valid = false;
    }

    if(!this.new_relationship.person2) {
      this.errors.push("Defina a pessoa a relacionar");
      this.new_relationship.valid = false;
    }
  }

  private setup_new_relationship() {
    this.new_relationship = {
      valid: true,
      person2: null,
      person: this.person
    }
  }
}