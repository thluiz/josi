import { SecurityService } from 'app/services/security-service';
import { Component, Input, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';

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

import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/delay';

import { debounceTime } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
import { CurrentActivitiesComponent } from 'app/shared/components/current-activities/current-activities.component';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './agenda-page.component.html',
  styleUrls: ['../diary.component.scss'],
  providers: [DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class AgendaPageComponent implements OnInit, OnDestroy, AfterViewInit {
  
  agenda;
  original_agenda: any[];
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

  @ViewChild(CurrentActivitiesComponent) 
  private current_activities : CurrentActivitiesComponent; 

  private update_agenda_timer;  
  private incident_changes_subscriber: Subscription;
  private incident_added_subscriber: Subscription;
  private person_changes_subscriber: Subscription;  

  constructor(private personService: PersonService, 
              private incidentService: IncidentService, 
              private parameterService: ParameterService,
              private modalService: NgbModal, 
              private datePickerConfig: NgbDatepickerConfig,
              private securityService: SecurityService) {

    datePickerConfig.firstDayOfWeek = 7
    const date = new Date();

    this.current_date = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }
  }  
 
  ngAfterViewInit(): void {    
  }

  ngOnInit() {    
    this.parameterService.getActiveBranches().subscribe(data => {    
      const result = data;   
      this.branches = result;
    },
    err => console.error(err));

    this.parameterService.getIncidentTypes().subscribe(data => {    
      const result = data;   
      this.manual_incident_types = result.filter(i => !i.automatically_generated);
    },
    err => console.error(err));
    
    this.incident_changes_subscriber = this.incidentService.incidentsChanges$
      .debounceTime(1000)
      .delay(1000)            
      .subscribe((next) => {      
        this.getAgendaData();
      });

    this.incident_added_subscriber = this.incidentService.incidentAdd$        
    .subscribe((next) => {      
      this.getAgendaData();
    });   
          
      
    this.securityService.getCurrentUserData().subscribe((user) => {
      this.current_branch = user.default_branch_id || 0;      
      this.getAgendaData();
    }); 
  }

  ngOnDestroy() {    
    if(this.update_agenda_timer) {    
      clearTimeout(this.update_agenda_timer);
    }    
    
    this.incident_added_subscriber.unsubscribe();        
    this.incident_changes_subscriber.unsubscribe();        
  }

  change_current_date(date) {
    this.getAgendaData();
  }

  branchSelected(id) {      
    this.current_branch = id;  
    this.filter_incidents();
    this.show_change_branch = false;
     
    this.current_activities.filter_activities(this.current_branch);

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
  
  open(content, incident) {
    this.current_incident = incident;            
    this.modalService.open(content).result.then((result) => {          
        this.current_incident = null;                              
    }, (reason) => {
        console.log(reason);
    });
  }
  
  getAgendaData() {    
    this.personService.getDailyAgenda(0, this.current_date).subscribe(
      data => {    
        const result = data as any;           
        this.original_agenda = result;
        
        this.branchSelected(this.current_branch);        
      } 
    );

    var d = new Date();
    var hours = d.getHours();
    
    const update_interval = hours >= 22 || hours < 6 ? 1800000 : 120000;

    if(this.update_agenda_timer) {
      clearTimeout(this.update_agenda_timer);
    }

    this.update_agenda_timer = setTimeout(() => { this.getAgendaData() }, update_interval);
  }
   
}
