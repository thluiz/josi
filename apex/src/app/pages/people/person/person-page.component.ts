import { ActivatedRoute } from '@angular/router';
import { PersonService } from './../../../services/person-service';
import {  Component, TemplateRef, ViewChild, ViewEncapsulation, Input  } from '@angular/core';

import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { FormControl, FormsModule, ReactiveFormsModule,
  FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbModal, 
ModalDismissReasons, 
NgbActiveModal,
NgbDateParserFormatter,
NgbDatepickerI18n,
NgbDatepickerConfig
} from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.scss'],  
  providers: [PersonService, DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class PersonPageComponent implements OnInit, OnDestroy  {
  id: number;
  person: any;    
  new_role: any;
  new_schedule: any = {};
  manual;
  incident_types;
  manual_incident_types;

  private sub: any;

  constructor(private personService: PersonService, 
              private route: ActivatedRoute, 
              private modalService: NgbModal,
              private datePickerConfig: NgbDatepickerConfig) {      
  }  

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];      
      
      this.load_person_data();      
    });
    this.reset_new_schedule();
  }
  
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  
  open(content, incident){        
    this.modalService.open(content).result.then((result) => {                                  
        
    }, (reason) => {
        console.log(reason);
    });

  }  

  add_role() {
    if(!this.new_role) {
      return;
    }
    this.personService.addRole(this.id, this.new_role).toPromise().then(() => {
      this.load_person_data();
    });
  }

  remove_role(role_id) {
    this.personService.removeRole(this.id, role_id).toPromise().then(() => {
      this.load_person_data();
    });
  }

  begin_remove_role(person_role) {
    person_role.removing = true;
  }

  cancel_remove_role(person_role) {
    person_role.removing = false;
  }

  load_person_data() {
    this.personService.getAllData(this.id).subscribe(
      data => {           
        const result = data.json();    
        this.person = result;
        
        this.incident_types = result.incident_types;
        this.manual_incident_types = this.incident_types.filter(f => !f.automatically_generated);
      }
    );
  }

  begin_remove_schedule(schedule) {
    schedule.begin_remove = true;
  }

  rollback_remove_schedule(schedule) {
    schedule.begin_remove = false;
  }

  remove_schedule(schedule) {
    this.personService.remove_schedule(schedule)
    .toPromise()
    .then(() => {
      this.load_person_data();
    });
  }

  save_schedule() {
    let start_date = this.new_schedule.start_date_tmp;
    if(start_date) {
      this.new_schedule.start_date = `${start_date.year}-${start_date.month}-${start_date.day}`;
    }

    if(this.new_schedule.time) {
      this.new_schedule.start_hour = this.new_schedule.time.hour;
      this.new_schedule.start_minute = this.new_schedule.time.minute;    
    }

    if(this.new_schedule.type) {
      this.new_schedule.incident_type = this.new_schedule.type.id;
    }
    
    this.personService.save_schedule(this.new_schedule)
    .toPromise()
    .then(() => {
      this.load_person_data();
      this.reset_new_schedule();
    });
  }

  reset_new_schedule() {
    this.new_schedule = {      
      person_id: this.id
    };
  }

  reset_new_schedule_type(){
    this.new_schedule.type = null;
    this.new_schedule.tmp_combo_type = null;
    this.new_schedule.tmp_type = null;
    this.new_schedule.children_type = null;
    this.validate_new_schedule();
  }

  change_new_schedule_type(tp) {    
    const t = this.person.incident_types.filter(t => t.id == tp);
    if(t.length != 1) {
      return;
    } 
    const type = t[0];
    
    if(type.childrens != null) {
      this.new_schedule.type = null;
      this.new_schedule.tmp_type = type;
      this.new_schedule.correct = false;
    } else {
      this.new_schedule.tmp_type = type;
      this.new_schedule.type = type;
    }
  }

  change_new_schedule_children_type(tp) {    
    const t = this.new_schedule.tmp_type.childrens.filter(t => t.id == tp);
    if(t.length != 1) {
      return;
    } 
    const type = t[0];
    this.new_schedule.children_type = type;
    this.new_schedule.type = type;    
  }

  validate_new_schedule() {
    this.new_schedule.correct = false;
    let schedule = this.new_schedule;

    console.log(this.new_schedule.time);

    if(parseInt(schedule.person_id, 10) > 0
      && parseInt(schedule.branch_id, 10) > 0
      && schedule.type != null
      && parseInt(schedule.recurrence_type, 10) > 0
      && parseInt(schedule.number_of_incidents, 10) > 0
      && schedule.start_date_tmp != null) {
        if(schedule.type.need_value
          && (!schedule.value || schedule.value <= 0)) {          
          return;
        }

        if(schedule.type.need_start_hour_minute && !schedule.time) {          
          return;
        }

        this.new_schedule.correct = true;           
      }
  }

  validate_new_schedule_value() {
    if(parseFloat(this.new_schedule.value) != NaN) {      
      this.validate_new_schedule();
      return;
    }
    this.new_schedule.value = 0;
    this.validate_new_schedule();
  }

  showPage(str) {

  }  
}
