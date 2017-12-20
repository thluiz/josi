import { Component, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';

import { PersonService } from 'app/services/person-service';
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
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

import { IntervalObservable } from "rxjs/observable/IntervalObservable";

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

import { Observable } from 'rxjs/Observable';
import { debounceTime } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { catchError } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './sumary-page.component.html',
  styleUrls: ['./sumary-page.component.scss'],
  providers: [PersonService, IncidentService]
})
export class SumaryPageComponent implements OnInit {
  daily: Observable<any[]>;
  cols;
  sumary_cols;
  current_week_range;
  current_week_day;  
  current_week = 0;
  current_branch = 1;
  current_branch_name = "";
  branches;
  domains;
  incident_types;
  dpReschedule;
  current_incident;
  new_incident : any = {};
  sumary;
  show_change_branch = false;
  update_timer;
  closeResult: string;  
  newIncidentForm: FormGroup;
  week_days;
  branch_cols;
  activity_sumary;
  
  private alive;

  constructor(private personService: PersonService, 
              private incidentService: IncidentService, 
              private modalService: NgbModal) {

    this.current_week_day = (new Date).getDay() - 1;  

  }
  
  ngOnInit() {
    this.getMonitorData();    
    this.alive = true;      
  }

  ngOnDestroy() {    
    this.alive = false;
    console.log('destroy timer!');
  }

  branchSelected(id) {
    clearTimeout(this.update_timer);
    this.update_timer = null;        
    this.current_branch = id;
    this.getMonitorData();
  }

  change_week(modifier) {
    clearTimeout(this.update_timer);
    this.update_timer = null;
    this.current_week += modifier;
    this.getMonitorData();
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

  close_incident(incident) {
    incident.closed = true;        

    this.incidentService.close_incident(incident)
    .toPromise().then((response) => {
      this.getMonitorData();
    }).catch((reason) => {
      console.log(reason);
    });      
  }

  remove_incident(incident) {
    this.incidentService.remove_incident(incident)
    .toPromise().then((response) => {
      this.getMonitorData();
    }).catch((reason) => {
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
    })
    .toPromise().then((response) => {
      this.getMonitorData();
    }).catch((reason) => {
      console.log(reason);
    }); 
  }

  change_new_incident_type(tp) {    
    const t = this.incident_types.filter(t => t.id == tp);
    if(t.length != 1) {
      return;
    } 
    const type = t[0];
    
    console.log(type);

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
    console.log(this.new_incident);

    this.incidentService.register_new_incident(this.new_incident)
    .toPromise().then((response) => {
      this.getMonitorData();
    }).catch((reason) => {
      console.log(reason);
    });

    this.reset_new_incident();
  } 

  reset_new_incident() {    
    let date = new Date();

    this.new_incident = {
      branch: { id: this.current_branch },
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

  reset_new_incident_type(){
    this.new_incident.type = null;
    this.new_incident.tmp_type = null;
    this.new_incident.children_type = null;
    this.validate_new_event();
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

  begin_remove_incident(incident) {
    incident.begin_remove = true;
  }

  rollback_remove_incident(incident) {
    incident.begin_remove = false;
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
    if(this.new_incident.people != null
      && this.new_incident.people.length > 0
      && this.new_incident.type != null
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
            return <string[]>response.json(); 
          })
          .do(() => this.search_failed = false)
          .catch(() => {
            this.search_failed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching_people = false)

  register_contact_for_incident(incident) {
    this.incidentService.register_contact_for_incident(incident, { 
      contact_text: incident.contact_text 
    })
    .toPromise().then((response) => {
      this.getMonitorData();
    }).catch((reason) => {
      console.log(reason);
    }); 
  }
  
  open_new_activity_from_existent(content, incident) {
    this.new_incident = incident;      
    this.modalService.open(content).result.then((result) => {          
        this.current_incident = null;                      
        this.closeResult = `Closed new activty with: ${result}`;
    }, (reason) => {
        console.log(reason);
    });
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
    this.personService.getDailyMonitor(this.current_branch, this.current_week).subscribe(
      data => {          
        const result = data.json();
        this.branches = result.branches;
        this.current_branch_name = this.branches.filter(b => b.id == this.current_branch)[0].name;
        this.domains = result.domains;   
        this.incident_types = result.incident_types;
        this.current_week_range = result.current_week_range;
        this.week_days = result.columns;
        this.activity_sumary  = result.activity_sumary;
        this.sumary = result.sumary;
        this.cols = [                    
          { width: "24.5%" },
          { width: "3%", icon: "ft-calendar", description: "Agendamento" },
          { width: "3%", icon: "icon-wallet", description: "Financeiro" },
          { width: "3%", icon: "ft-radio", description: "Comunicados" }
        ];

        this.sumary_cols = [                    
          { width: "88%", name: "Membros" },
          { width: "3%", icon: "fa fa-user", description: "Membros" },
          { width: "3", icon: "ft-calendar", description: "Agendamento" },
          { width: "3%", icon: "icon-wallet", description: "Financeiro" },
          { width: "3%", icon: "ft-radio", description: "Comunicados" }
        ];        
        
        for(var i = 0; i< result.columns.length; i++) {
          let c = result.columns[i];
          this.cols[this.cols.length] = {
            prop: 'incidents' + c.date,
            name: c.name,
            current: c.current,
            width: '9.5%'
          };
        }

        if(this.domains) {
          this.domains.daily = [];

          for(var w = 0; w < result.domains.length; w++) {
            let domain = result.domains[w];
            this.domains[w].daily = [];
            let people = result.people != null ? result.people.filter(p => p.domain_id == domain.id) : [];
            this.domains[w].number_of_members = people.length;

            for(var i = 0; i< result.columns.length; i++) {    
              let c = result.columns[i];
              
              for(var z = 0; z< people.length; z++) {
                let person_incidents = people[z];  
                if(!person_incidents.dates) {
                  person_incidents.dates = [];
                }

                person_incidents.dates[i] = person_incidents.dates[i] || [];
                let incidents = result.incidents.filter((i : any) => { 
                  return i.date == c.date && i.person_id == people[z].person_id;
                });

                if(incidents.length > 0) {
                  person_incidents.dates[i] = person_incidents.dates[i].concat(incidents);              
                }

                this.domains[w].daily[z] = person_incidents;
              }
            }       
          }   
        }                
      },
      err => console.error(err)      
    );

    var d = new Date();
    var hours = d.getHours();
    
    const update_interval = hours >= 22 || hours < 6 ? 600000 : 30000;

    if(this.update_timer) {
      clearTimeout(this.update_timer);
    }

    this.update_timer = setTimeout(() => { this.getMonitorData() }, update_interval);
  }
   
}
