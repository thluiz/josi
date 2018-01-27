import { Observable } from 'rxjs/Observable';
import { Component, Input, OnInit, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { PersonService } from 'app/services/person-service';
import { IncidentService } from 'app/services/incident-service';
import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'incident-treatment-modal',
  templateUrl: './incident-treatment-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss'],
  providers: [ DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})

export class IncidentTreatmentModalComponent implements OnInit {    
  current_incident : any;  

  @ViewChild('content') incident_treatment_modal: ElementRef;

  constructor(private datePickerConfig: NgbDatepickerConfig,     
    private incidentService: IncidentService, 
    private ngbModalService: NgbModal,
    private personService: PersonService) {
   
      datePickerConfig.firstDayOfWeek = 7
  }

  ngOnInit() {
         
  }

  open(incident) {    
    this.current_incident = incident;
    this.ngbModalService.open(this.incident_treatment_modal).result.then((result) => {                                  
      
    }, (reason) => {        
        console.log(reason);
    });         
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
      && (!incident.closing_contact_text
      || incident.closing_contact_text.length < 5)) {
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

    incident.closed = true;        

    this.incidentService.close_incident(incident)
    .toPromise()
    .catch((reason) => {      
      console.log(reason);      
    });      

    if(close_action) {
      close_action();
    }
  }

  remove_incident(incident) {
    this.incidentService.remove_incident(incident)
    .toPromise().catch((reason) => {
      console.log(reason);
    });
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
    }).toPromise().catch((reason) => {
      console.log(reason);
    }); 
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
      .toPromise()
      .then((value) => close_modal_action())
      .catch((reason) => {
        console.log(reason);
      }); 
  }

  reopen_incident(incident, close_modal_action) {
    this.incidentService.reopen_incident(incident)
      .toPromise()
      .then((value) => close_modal_action())
      .catch((reason) => {
        console.log(reason);
      }); 
  }  

  cancel_start_incident(incident, close_modal_action) {
    this.incidentService.cancel_start_incident(incident)
      .toPromise()
      .then((value) => { 
        close_modal_action()
        incident.cancelling_start = false;
      })
      .catch((reason) => {
        console.log(reason);
      }); 
  }

  register_contact_for_incident(incident, close_modal_action) {
    if(!this.validade_treatment_contact_text(incident)) {
      return;
    }

    this.incidentService.register_contact_for_incident(incident, { 
      contact_text: incident.contact_text 
    }).toPromise().then((value) => close_modal_action()).catch((reason) => {
      console.log(reason);
    });     
  }  
}