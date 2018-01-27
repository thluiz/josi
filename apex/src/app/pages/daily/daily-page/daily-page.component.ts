import { Component } from '@angular/core';

import { PersonService, DailyMonitorDisplayType } from 'app/services/person-service';
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
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './daily-page.component.html',
  styleUrls: ['../daily.component.scss'],
  providers: [PersonService, IncidentService, DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class DailyPageComponent implements OnInit, OnDestroy {
  daily: Observable<any[]>;
  cols;
  
  people_summary : Observable<any[]>;

  current_display = 1;
  selected_week;
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
  week_days;
  branch_cols;
  external_people;  

  private update_members_timer;
  private update_summary_timer;
  private incident_added_subscriber : Subscription;
  private incident_changes_subscriber: Subscription;

  constructor(public personService: PersonService, 
              public incidentService: IncidentService, 
              private modalService: NgbModal, 
              private datePickerConfig: NgbDatepickerConfig,
              private route: ActivatedRoute,
              private router: Router) {

    datePickerConfig.firstDayOfWeek = 7

    this.current_week_day = (new Date).getDay() - 1;
    
    if(this.current_week_day < 0) {
      this.current_week_day = 6;
    }
        
    this.incident_added_subscriber = incidentService.incidentAdd$.subscribe((next) => {      
      this.getMonitorData();
    });  
    
    this.incident_changes_subscriber = incidentService.incidentsChanges$.subscribe((next) => {      
      this.getMonitorData();
    }); 
  }

  ngOnInit() {
    this.getMonitorData();  
           
  }

  ngOnDestroy() {    
    if(this.update_members_timer) {    
      clearTimeout(this.update_members_timer);
    }    

    if(this.update_summary_timer) {    
      clearTimeout(this.update_summary_timer);
    }
    if(this.incident_added_subscriber) {
      this.incident_added_subscriber.unsubscribe();
    }

    if(this.incident_changes_subscriber) {
      this.incident_changes_subscriber.unsubscribe();
    }
  }
    
  branchSelected(id) {
    clearTimeout(this.update_members_timer);
    this.update_members_timer = null;        
    this.current_branch = id;
    this.getMonitorData();    
    this.show_change_branch = false;
  }

  change_week(modifier) {
    clearTimeout(this.update_members_timer);
    this.update_members_timer = null;
    this.current_week += modifier;
    this.getMonitorData();
  }
    
  open(content, incident){
      this.current_incident = incident;            
      this.modalService.open(content).result.then((result) => {          
          this.current_incident = null;                      
          this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
          console.log(reason);
      });
  }
    
  getMonitorData() {

    if(!this.personService) {
      return;
    }
    this.personService.getDailyMonitor(this.current_branch, DailyMonitorDisplayType.Day, this.current_week).subscribe(
      data => {    
        const result = data.json();        
        
        this.branches = result.branches;
        this.current_branch_name = (this.current_branch > 0 ? 
                            this.branches.filter(b => b.id == this.current_branch)[0].name
                            : "Todos os Núcleos");
        this.domains = result.domains;   
        this.incident_types = result.incident_types;
        this.manual_incident_types = this.incident_types.filter(f => !f.automatically_generated);
        this.current_week_range = result.current_week_range;
        this.week_days = result.week_days;        
        this.selected_week = result.selected_week[0];

        this.cols = [                    
          { width: "20%" }
        ];
                
        for(var i = 0; i< this.week_days.length; i++) {
          let c = this.week_days[i];
          this.cols[this.cols.length] = {
            prop: 'incidents' + c.date,
            name: c.name,
            current: c.current,
            width: '60%'
          };
        }

        if(this.domains) {
          this.domains.daily = [];

          for(var w = 0; w < result.domains.length; w++) {
            let domain = result.domains[w];
            this.domains[w].daily = [];
            let people = result.people != null ? result.people.filter(p => p.domain_id == domain.id) : [];
            this.domains[w].number_of_members = people.length;

            for(var i = 0; i< this.week_days.length; i++) {    
              let c = this.week_days[i];
              
              for(var z = 0; z< people.length; z++) {
                let person_incidents = people[z];  
                if(!person_incidents.dates) {
                  person_incidents.dates = [];
                }

                person_incidents.dates[i] = person_incidents.dates[i] || [];
                let incidents = result.incidents.filter((i : any) => { 
                  return i.date == c.date && i.person_id == people[z].person_id;
                });
                
                person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);                              

                this.domains[w].daily[z] = person_incidents;
              }
            }       
          }   

          this.external_people = [];
          let external_people = result.people.filter(p => p.branch_id == -1 
                                                    || (this.current_branch > 0 && p.branch_id != this.current_branch));
          for(var i = 0; i< this.week_days.length; i++) {    
            let c = this.week_days[i];
            
            for(var z = 0; z < external_people.length; z++) {
              let person_incidents = external_people[z];  
              if(!person_incidents.dates) {
                person_incidents.dates = [];
              }

              person_incidents.dates[i] = person_incidents.dates[i] || [];
              let incidents = result.incidents.filter((i : any) => { 
                return i.date == c.date && i.person_id == external_people[z].person_id;
              });

              if(incidents.length > 0) {
                person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);              
              }

              this.external_people[z] = person_incidents;
            }
          } 
        }                
      },
      err => console.error(err)      
    );

    var d = new Date();
    var hours = d.getHours();
    
    const update_interval = hours >= 22 || hours < 6 ? 600000 : 120000;

    if(this.update_members_timer) {
      clearTimeout(this.update_members_timer);
    }

    this.update_members_timer = setTimeout(() => { this.getMonitorData() }, update_interval);
  }
   
}


