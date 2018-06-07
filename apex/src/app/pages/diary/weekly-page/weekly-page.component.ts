import { ApplicationEventService } from 'app/services/application-event-service';
import { Component, ViewChildren, QueryList } from '@angular/core';

import { PersonService, DailyMonitorDisplayType } from 'app/services/person-service';
import { IncidentService, INCIDENT_ACTION_PREFIX, INCIDENT_ADDED } from 'app/services/incident-service';
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

import { IntervalObservable } from "rxjs/observable/IntervalObservable";

import { Subscription ,  Observable } from 'rxjs';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'app/services/security-service';
import { LateralSummaryComponent } from 'app/shared/components/lateral-summary/lateral-summary.component';
import { filter } from 'rxjs/operators';
import { Result } from 'app/shared/models/result';
import { LightIncident } from 'app/shared/models/incident-model';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './weekly-page.component.html',
  styleUrls: ['../diary.component.scss'],
  providers: [DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class WeeklyPageComponent implements OnInit, OnDestroy {

  @ViewChildren(LateralSummaryComponent) 
  lateralSummaryComponent : QueryList<LateralSummaryComponent>;

  daily: Observable<any[]>;
  cols;

  selected_week;
  current_display:any = 0;
  current_week_range;
  current_week_day;  
  current_week = 0;
  current_branch;
  current_branch_name = "";
  branches;
  domains;
  incident_types;
  manual_incident_types;
  dpReschedule;
  current_incident;
  new_incident : any = {};  
  show_change_branch = false;  
  closeResult: string;  
  newIncidentForm: FormGroup;
  week_days;
  branch_cols;
  external_people;    
  
  private incidents_subscriber : Subscription;

  constructor(private personService: PersonService, 
              private incidentService: IncidentService, 
              private securityService: SecurityService,
              private modalService: NgbModal, 
              private datePickerConfig: NgbDatepickerConfig,
              private route: ActivatedRoute,
              private eventManager: ApplicationEventService,
              private router: Router) {

    datePickerConfig.firstDayOfWeek = 7

    this.current_week_day = (new Date).getDay() - 1;
    
    if(this.current_week_day < 0) {
      this.current_week_day = 6;
    }
  }
  
  ngOnInit() {    
    this.securityService.getCurrentUserData().subscribe((user) => {
      this.current_branch = user.default_branch_id || 0;      
      this.getMonitorData();  
    });   

    this.incidents_subscriber = this.eventManager
    .event$
    .pipe(
      filter((result : Result<LightIncident[]>) =>  
      result.data && result.data.length > 0      
      && result.type.indexOf(INCIDENT_ADDED) > -1)
    ).subscribe((result) => {      
      this.current_incident = result.data[0];
    });
  }

  ngOnDestroy() {    
    if(this.incidents_subscriber) {
      this.incidents_subscriber.unsubscribe();
    }
  }

  branchSelected(id) {    
    this.current_branch = id;
    this.getMonitorData();    
    this.show_change_branch = false;

    if(this.lateralSummaryComponent) {
      this.lateralSummaryComponent.forEach(ls => {
        ls.branch = this.current_branch;
        ls.getPeopleSummaryData()
      });
    }
  }

  change_week(modifier) {    
    this.current_week += modifier;
    this.getMonitorData();    
  }

  getMonitorData() {
    this.personService.getDailyMonitor(this.current_branch, DailyMonitorDisplayType.Week, this.current_week)
    .subscribe((result : Result<any>) => {    
        const data = result.data[0] as any;          
        
        this.branches = data.branches as any;
        this.current_branch_name = (this.current_branch > 0 ? 
                            this.branches.filter(b => b.id == this.current_branch)[0].name
                            : "Todos os Núcleos");
        this.domains = data.domains;   
        this.incident_types = data.incident_types;
        this.manual_incident_types = this.incident_types.filter(f => !f.automatically_generated);
        this.current_week_range = data.current_week_range;
        this.week_days = data.week_days;        
        this.selected_week = data.selected_week[0];

        this.cols = [                    
          { width: "24.5%" }          
        ];
                
        for(var i = 0; i< this.week_days.length; i++) {
          let c = this.week_days[i];
          this.cols[this.cols.length] = {
            prop: 'incidents' + c.date,
            name: c.name,
            current: c.current,
            width: '9.5%'
          };
        }

        if(this.domains) {
          this.domains.daily = [];

          for(let w = 0; w < data.domains.length; w++) {
            let domain = data.domains[w];
            this.domains[w].daily = [];
            let people = data.people != null ? data.people.filter(p => p.domain_id == domain.id) : [];
            this.domains[w].number_of_members = people.length;

            for(let i = 0; i< this.week_days.length; i++) {    
              let c = this.week_days[i];
              
              for(let z = 0; z< people.length; z++) {
                let person_incidents = people[z];  
                
                if(!person_incidents.dates) {
                  person_incidents.dates = [];
                }

                person_incidents.dates[i] = person_incidents.dates[i] || [];
                
                let incidents = data.incidents.filter((k : any) => { 
                  const incident_date = new Date(k.date);
                  const week_day_date = new Date(c.date);  
                  debugger;
                  return incident_date.getUTCDate() == week_day_date.getUTCDate()
                          && incident_date.getUTCFullYear() == week_day_date.getUTCFullYear()
                          && incident_date.getUTCMonth() == week_day_date.getUTCMonth()
                          && k.person_id == people[z].person_id;
                });
                
                person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);                              

                this.domains[w].daily[z] = person_incidents;
              }
            }       
          }
        }   

        this.load_external_people(data); 
      }                
      ,
      err => console.error(err)      
    );    
  }

  private load_external_people(result) {
    this.external_people = [];        
    let external_people =  [];        
    if(this.current_branch == 0) {
      external_people = result.people.filter(p => p.is_interested || p.is_service_provider
        || p.is_associated_with_member || p.is_external_member);
    } else {
      external_people = result.people.filter(p => p.is_interested || p.is_service_provider
        || p.is_associated_with_member || p.is_external_member || p.branch_id != this.current_branch);
    }
    
    for(let i = 0; i< this.week_days.length; i++) {    
      let c = this.week_days[i];
      
      for(let z = 0; z < external_people.length; z++) {
        let person_incidents = external_people[z];  
        if(!person_incidents.dates) {
          person_incidents.dates = [];
        }

        person_incidents.dates[i] = person_incidents.dates[i] || [];
        
        let incidents = result.incidents.filter((k : any) => {
          const incident_date = new Date(k.date);
          const week_day = new Date(c.date);

          return incident_date.getUTCDate() == week_day.getUTCDate() 
                          && incident_date.getUTCFullYear() == week_day.getUTCFullYear()
                          && incident_date.getUTCMonth() == week_day.getUTCMonth()
                          && k.person_id == external_people[z].person_id;
        });

        if(incidents.length > 0) {
          person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);              
        }

        this.external_people[z] = person_incidents;
      }            
    }
  }
   
}
