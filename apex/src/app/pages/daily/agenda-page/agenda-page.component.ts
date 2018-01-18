import { Component, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import { PersonService, DailyMonitorDisplayType } from 'app/services/person-service';
import { ParameterService } from 'app/services/parameter-service';
import { IncidentService } from 'app/services/incident-service';
import { FormControl, FormsModule, ReactiveFormsModule,
        FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbModal, 
  NgbDateStruct, 
  NgbDatepickerI18n, 
  NgbDatepickerModule,
  NgbCalendar, 
  NgbTimeStruct,      
  ModalDismissReasons, 
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';

import { debounceTime } from 'rxjs/operators';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './agenda-page.component.html',
  styleUrls: ['../daily.component.scss'],
  providers: [PersonService, IncidentService, ParameterService, DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class AgendaPageComponent implements OnInit, OnDestroy {
  agenda;
  original_agenda: Observable<any[]>;
  show_change_branch;
  current_week = 0;
  current_incident;
  current_branch = 0;
  selected_week;
  new_activity;
  current_branch_name = "Todos os Núcleos";
  branches;
  current_date;
  manual_incident_types;

  private update_agenda_timer;  
  private incident_changes_subscriber: Subscription;
  private incident_added_subscriber: Subscription;

  constructor(public personService: PersonService, 
              public incidentService: IncidentService, 
              private parameterService: ParameterService,
              private modalService: NgbModal, 
              private datePickerConfig: NgbDatepickerConfig) {

    datePickerConfig.firstDayOfWeek = 7
    const date = new Date();

    this.current_date = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }

    this.incident_changes_subscriber = incidentService.incidentsChanges$
      .debounceTime(1000)
      .delay(1000)            
      .subscribe((next) => {      
        this.getMonitorData();
      });

    this.incident_added_subscriber = incidentService.incidentAdd$        
      .subscribe((next) => {      
        this.getMonitorData();
      });
  }
    
  ngOnInit() {
    this.parameterService.getActiveBranches().subscribe(data => {    
      const result = data.json();   
      this.branches = result;
    },
    err => console.error(err));

    this.parameterService.getIncidentTypes().subscribe(data => {    
      const result = data.json();   
      this.manual_incident_types = result.filter(i => !i.automatically_generated);
    },
    err => console.error(err));

    

    this.getMonitorData();   
  }

  ngOnDestroy() {    
    if(this.update_agenda_timer) {    
      clearTimeout(this.update_agenda_timer);
    }    

    if(this.incident_added_subscriber) {
      this.incident_added_subscriber.unsubscribe();
    }

    if(this.incident_changes_subscriber) {
      this.incident_changes_subscriber.unsubscribe();
    }
  }

  change_current_date(date) {
    this.getMonitorData();
  }

  branchSelected(id) {    
    this.filter_incidents();
    this.show_change_branch = false;

    if(this.current_branch == 0) {
      this.current_branch_name = "Todos os Núcleos";
      return;
    }

    const current = this.branches.find((b) => b.id == this.current_branch);
    this.current_branch_name = current.name;    
  }

  filter_incidents() {  
    this.agenda = [];  
    this.original_agenda.forEach((original_schedule : any) => {
        let schedule = original_schedule;      
        schedule.current_incidents = original_schedule.incidents
                                      .filter((i) => this.current_branch == 0 || i.branch_id == this.current_branch);
        this.agenda[this.agenda.length] = schedule;
    });
  }

  change_week(modifier) {
    clearTimeout(this.update_agenda_timer);
    this.update_agenda_timer = null;
    this.current_week += modifier;
    this.getMonitorData();
  }  
  start_incident(incident) {
    let date = new Date();    
    incident.started_on_hour = date.getHours() + ":" + date.getMinutes();

    this.incidentService.start_incident(incident)
    .toPromise()    
    .catch((reason) => {
      console.log(reason);
    }); 
  }

  begin_treat_incident(content, incident) {    
    let t =JSON.parse(JSON.stringify(incident))
    t.in_treatment = true;

    this.open(content, t);
  }

  open(content, incident) {
    this.current_incident = incident;            
    this.modalService.open(content).result.then((result) => {          
        this.current_incident = null;                              
    }, (reason) => {
        console.log(reason);
    });
  }

  close_incident(incident) {
    incident.closed = true;        

    this.incidentService.close_incident(incident)
    .toPromise().catch((reason) => {
      console.log(reason);
    }); 
  }

  getMonitorData() {
    if(!this.personService) {
      return;
    }
    this.personService.getDailyAgenda(this.current_branch, this.current_date).subscribe(
      data => {    
        const result = data.json();   
        this.original_agenda = result;
        this.filter_incidents();
      },
      err => console.error(err)      
    );

    var d = new Date();
    var hours = d.getHours();
    
    const update_interval = hours >= 22 || hours < 6 ? 600000 : 30000;

    if(this.update_agenda_timer) {
      clearTimeout(this.update_agenda_timer);
    }

    this.update_agenda_timer = setTimeout(() => { this.getMonitorData() }, update_interval);
  }
   
}
