import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationEventService } from 'app/services/application-event-service';
import { ModalService, ModalType } from 'app/services/modal-service';
import { Observable ,  Subscription } from 'rxjs';
import { Component, Input, OnDestroy, OnInit, Output, EventEmitter, ElementRef, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CardService } from 'app/services/card-service';
import { IncidentService, INCIDENT_ACTION_PREFIX } from 'app/services/incident-service';
import { PersonService } from 'app/services/person-service';
import { filter } from 'rxjs/operators';
import { Result } from 'app/shared/models/result';
import { LightIncident } from 'app/shared/models/incident-model';
import { PersonIncidentHistoryListComponent } from '../person-incident-history-list/person-incident-history-list.component';


@Component({
  selector: 'incident-treatment-modal',
  templateUrl: './incident-treatment-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})

export class IncidentTreatmentModalComponent implements OnInit, OnDestroy {    
  current_incident : any;  
  person: any;
  history_start_date : NgbDateStruct;
  history_end_date : NgbDateStruct;
  comments: any[] = [];

  @ViewChild('content') incident_treatment_modal: ElementRef;
  
  @ViewChildren(PersonIncidentHistoryListComponent) 
  historyListComponent : QueryList<PersonIncidentHistoryListComponent>;

  private incidents_subscriber : Subscription;

  constructor(private datePickerConfig: NgbDatepickerConfig,     
    private incidentService: IncidentService, 
    private ngbModalService: NgbModal,
    private modalService: ModalService,
    private personService: PersonService,
    private eventManager: ApplicationEventService,
    private cardService: CardService) {
   
      datePickerConfig.firstDayOfWeek = 7
  }

  ngOnInit() {
    this.incidents_subscriber = this.eventManager
    .event$
    .pipe(
      filter((result : Result<LightIncident[]>) =>  
      result.data && result.data.length > 0
      && this.current_incident
      && result.data[0].id == this.current_incident.id
      && result.type.indexOf(INCIDENT_ACTION_PREFIX) > -1)
    ).subscribe((result) => {      
      let r = result.data[0] as any;
      if(this.current_incident && result.data[0] && r.comment_count != null) {
        const comment_count = this.current_incident.comment_count || 0;
        if(comment_count != r.comment_count) {
          this.incidentService.getComments(this.current_incident.id)
          .subscribe((comments : any[]) => {
            this.comments = comments;
          })
        }
      }
      this.current_incident = result.data[0];
    });
  }

  ngOnDestroy() {    
    if(this.incidents_subscriber) {
      this.incidents_subscriber.unsubscribe();
    }
  }

  set_dates_from_string_date(end_date: string) {
    return this.set_dates_from_date(new Date(end_date));
  }

  set_dates_from_date(end_date: Date) {
    this.history_end_date = {
      year: end_date.getUTCFullYear(),
      day: end_date.getUTCDate(),
      month: end_date.getUTCMonth() + 1
    }
    this.history_start_date = this.getLastWeekFromDate(this.history_end_date);
  }

  private getLastWeekFromDate(date: NgbDateStruct) {
    let last_week = new Date(date.year, date.month, date.day - 7);

    return {
      year: last_week.getUTCFullYear(),
      day: last_week.getUTCDate(),
      month: last_week.getUTCMonth()
    };
  }

  open(incident) {  
    Observable.zip(
      this.incidentService.getIncidentDetails(incident.id), 
      this.personService.getData(incident.person_id),
      this.incidentService.getComments(incident.id),

      (incident_data : any, person: any, comments: any[]) => {
      this.current_incident = incident_data.data[0];
      this.person = person;
      this.comments = comments;
      this.set_dates_from_string_date(this.current_incident.date);      

      this.ngbModalService.open(this.incident_treatment_modal)
      .result.then((result) => {                                  
      
      }, (reason) => {        
          console.log(reason);
      });      
    })      
    .subscribe(); 
  }  

  begin_remove_incident(incident) {
    incident.begin_remove = true;
  }

  rollback_remove_incident(incident) {
    incident.begin_remove = false;
  }

  begin_treat_incident(incident) {
    incident.in_treatment = true;  
    
    if(incident.obrigatory) {
      this.begin_reschedule_incident(incident);
    }
  }
  
  begin_reschedule_incident(incident) {
    incident.reschedule = true;    

    const date = incident.date.split("-");
    incident.new_date = { "year": parseInt(date[0], 10), "month": parseInt(date[1], 10), "day": parseInt(date[2], 10) };
  
    const hour = incident.start_hour.split(":");    
    incident.new_time = { "hour": parseInt(hour[0]), "minute": parseInt(hour[1]) };
  }

  reset_treat_incident(incident) {
    incident.recontact = false;    
    incident.reschedule = false;    
    incident.in_treatment = false;
  }

  reset_reschedule(incident) {    
    incident.reschedule = false; 
    if(incident.obrigatory) {
      this.reset_treat_incident(incident);
    }       
  }

  validate_for_closing(incident) {
    if(incident.need_description_for_closing
      && (!incident.close_text
      || incident.close_text.length < 5)) {
        incident.valid_for_closing = false;
        return;
      }

      incident.valid_for_closing = true;
  }

  close_incident(incident, close_action) {
    this.validate_for_closing(incident);

    if(!incident.valid_for_closing) {
      return;
    }

    this.incidentService.close_incident(incident)
    .subscribe(data => {
      if(close_action) {
        close_action();
      }
    });          
  }

  remove_incident(incident) {
    this.incidentService.remove_incident(incident).subscribe();
  }

  reschedule_incident(incident) {
    incident.treated = true;
    let new_incident = {
      "small_date": incident.new_date.day + "/"+ incident.new_date.month,
      "date":  incident.new_date.year + "-"+ incident.new_date.month + "-" + incident.new_date.day,
      "start_hour": incident.new_time.hour + ":" + incident.new_time.minute,
      "closed": false,
      "abrev": incident.abrev,
      "person_id": incident.person_id,
      "type": incident.type,
      "value": incident.value,
      "id": 0,
      "short_description": incident.short_description,
      "long_description": incident.long_description
    }
    
    this.incidentService.reschedule_incident(incident, new_incident, { 
      contact_text: incident.contact_text 
    }).subscribe(); 
  }
  
  validade_treatment_contact_text(incident) {
    if(!incident.contact_text || incident.contact_text.length < 5) {
      incident.errors = incident.errors || [];
      incident.errors["need_contact_text"] = true;
      return false; 
    } 

    incident.errors = incident.errors || [];
    incident.errors["need_contact_text"] = false;    
    return true;
  }

  start_incident(incident, close_modal_action) {
    this.incidentService.start_incident(incident)
      .subscribe((value) => close_modal_action()); 
  }

  reopen_incident(incident, close_modal_action) {
    this.incidentService.reopen_incident(incident)
      .subscribe((value) => close_modal_action()); 
  }  

  cancel_start_incident(incident, close_modal_action) {
    this.incidentService.cancel_start_incident(incident)
    .subscribe((value) => { 
      close_modal_action()
      incident.cancelling_start = false;
    }); 
  }

  open_card_detail(card_id) {
    this.cardService.getCardData(card_id).subscribe((data) => {      
      this.modalService.open(ModalType.DetailTask, data[0]);
    });
  }

  register_contact_for_incident(incident, close_modal_action) {
    if(!this.validade_treatment_contact_text(incident)) {
      return;
    }

    this.incidentService.register_contact_for_incident(incident, { 
      contact_text: incident.contact_text 
    }).subscribe((data) => close_modal_action());            
  }  

  add_comment() {    
    this.modalService.open(ModalType.AddIncidentComment, this.current_incident);
  }

  archive_comment(comment) {    
    this.incidentService.archiveComment(comment, this.current_incident).subscribe();
  }
}