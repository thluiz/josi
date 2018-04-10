import { ParameterService } from 'app/services/parameter-service';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
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

@Component({
  selector: 'new-incident-modal',
  templateUrl: './new-incident-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})

export class NewInicidentModalComponent implements OnInit {  

  @Input() current_branch: any;

  new_incident: any;
  modalRef;
  branches: any;
  incident_types:any;  

  @ViewChild('add_incident_modal') add_incident_modal: ElementRef;  
  
  constructor(private datePickerConfig: NgbDatepickerConfig,         
    private ngbModalService: NgbModal, 
    private personService: PersonService, 
    private incidentService: IncidentService, 
    private parameterService: ParameterService) {
   
      datePickerConfig.firstDayOfWeek = 7
  }

  ngOnInit() {
    this.reset_new_incident();        
  }

  reset_new_incident_type(){
    this.new_incident.type = null;
    this.new_incident.tmp_type = null;
    this.new_incident.tmp_combo_type = null;
    this.new_incident.children_type = null;
    this.validate_new_event();
  }

  open(initial_state = { }) {      
    this.reset_new_incident(initial_state);    
    Observable.zip(
      this.parameterService.getActiveBranches(),            
      this.parameterService.getIncidentTypes(),     
      (branches, incident_types : any[]) => {
        this.branches = branches;        
        this.incident_types = incident_types.filter(i => !i.automatically_generated);

        this.open_modal(this.add_incident_modal, true);        
      }
    ).subscribe();                   
  }

  private open_modal(content, on_close_action = false) {
    this.modalRef = this.ngbModalService.open(content);

    this.modalRef.result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }

  searching_people;
  search_failed;

  people_typeahead_formatter = (x) => x.name;

  add_person_to_new_incident(event) {    
    if(!event.name) {
      return;
    }

    if(!this.new_incident.people) {
      this.new_incident.people = [];
    }

    this.new_incident.people.push(event);
    this.new_incident.tmp_person = "";
    this.validate_new_event();
  }
  
  remove_person_from_new_incident(person) {            
    this.new_incident.people = this.new_incident.people.filter(p => p.person_id != person.person_id);            
    this.validate_new_event();
  }

  validate_new_event_value() {
    if(parseFloat(this.new_incident.value) != NaN) {      
      this.validate_new_event();
      return;
    }
    this.new_incident.value = 0;
    this.validate_new_event();
  }

  validate_new_event() {  
    let new_incident = this.new_incident;

    if(new_incident.people != null
      && new_incident.people.length > 0
      && new_incident.type != null
      && new_incident.branch_id > 0
      && (!this.new_incident.type.need_description
          || ((this.new_incident.description || "").length > 3))
      && (
        !this.new_incident.type.need_value 
        || this.new_incident.value > 0
      )) {
        this.new_incident.correct = true;
        return;
    }    

    this.new_incident.correct = false;    
  }

  search_people = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching_people = true)
      .switchMap(term =>
        this.personService.search(term)
          .map(response =>  {             
            return <string[]>response; 
          })
          .do(() => this.search_failed = false)
          .catch(() => {
            this.search_failed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching_people = false)


      
  change_new_incident_type(tp) {    
    const t = this.incident_types.filter(t => t.id == tp);
    if(t.length != 1) {
      return;
    } 
    const type = t[0];
    
    if(type.childrens != null) {
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
    if(t.length != 1) {
      return;
    } 
    const type = t[0];
    this.new_incident.children_type = type;
    this.new_incident.type = type;    
  }

  register_new_incident() {         
    this.incidentService.register_new_incident(this.new_incident)    
    .do((next) => this.reset_new_incident())    
    .subscribe();        
  } 

  reset_new_incident(initial_state?) {    
    if(!initial_state) {
      initial_state = { }
    }

    if(initial_state.start_activity == undefined || initial_state.start_activity == null) {
      initial_state.start_activity = 0;
    }

    let date = new Date();

    this.new_incident = {
      branch_id: initial_state.branch_id,
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
  }

}