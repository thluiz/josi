
import {zip as observableZip,  Observable ,  of ,  Subscription } from 'rxjs';

import {filter,  debounceTime ,  delay ,  map ,  distinctUntilChanged ,  catchError ,  tap ,  switchMap } from 'rxjs/operators';
import { Card } from 'app/shared/models/card.model';
import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { PersonService } from 'app/services/person-service';
import { IncidentService } from 'app/services/incident-service';
import { UtilsService } from 'app/services/utils-service';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';


@Component({
  selector: 'person-financial-treatment-modal',
  templateUrl: './person-financial-treatment-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})

export class PersonFinancialTreatmentModalComponent implements OnInit {  
  person;
  branches = [];
  pending: { person: any[], incidents: any[] };
  without_schedule_payments = false;
  contacts = [];
  principal_contacts = [];
  show_only_principal_contacts = true;
  has_aditional_contacts = false;

  @ViewChild('financial_treatment_modal') financial_treatment_modal: ElementRef;
  
  private person_changes_subscriber: Subscription;
  private incident_changes_subscriber: Subscription;
  
  constructor(private personService: PersonService, 
    private parameterService: ParameterService,
    private utilsService: UtilsService,    
    private incidentService: IncidentService,
    private ngbModalService: NgbModal,
    private datePickerConfig: NgbDatepickerConfig) {
   
      datePickerConfig.firstDayOfWeek = 7
  }

  private person_id() {
    if(!this.person) {
      console.log("person nd");
      return 0;
    }
      
    return this.person.id || this.person.person_id
  }

  ngOnInit() {    
    this.person_changes_subscriber = this.personService.personChanges$.pipe(
    filter((data) => data != null && data.id == this.person_id()))
    .subscribe((data) => {                       
      this.load_data();
    });
  }  

  ngOnDestroy () {    
    this.person_changes_subscriber.unsubscribe();
    this.incident_changes_subscriber.unsubscribe();
  }

  open(person) {    
    this.person = person;
    observableZip(
      this.personService.getData(this.person_id()),
      this.personService.getPendingFinancial(this.person_id()),
      this.personService.getPersonContacts(this.person_id()),
      this.parameterService.getActiveBranches(),
      (person_data, pending_data: any, contacts, branches) => {        
        this.person = person_data;
        this.pending = pending_data.pending[0];
        this.without_schedule_payments = pending_data.pending[0].without_schedule_payments;
        this.person = this.pending.person[0];        
        this.load_contacts(contacts);
        this.branches = branches;

        if(this.contacts.length > 0 && this.principal_contacts.length == 0) {
          this.show_only_principal_contacts = false;
        }

        this.open_modal(this.financial_treatment_modal, true);

      }).subscribe();              
  }

  open_new_contact(content) {
    this.parameterService.getContactTypes().subscribe((data) => {
      this.open_modal(content);
    });    
  }

  private open_modal(content, on_close_action = false) {
    this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });
  }   

  private load_data() {
    this.personService.getPendingFinancial(this.person_id()).subscribe((missing_data) => {
      this.pending = missing_data as any;      
    });
  }
  
  private load_contacts(contacts) {
    this.contacts = contacts;
    this.principal_contacts = this.contacts.filter(ct => ct.principal);
    this.has_aditional_contacts = this.principal_contacts.length > 0 
                                  && this.principal_contacts.length != this.contacts.length;
    this.show_only_principal_contacts = this.contacts.filter(ct => ct.principal).length > 0;
  }
}