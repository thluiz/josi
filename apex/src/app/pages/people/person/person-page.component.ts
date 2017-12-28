import { ActivatedRoute } from '@angular/router';
import { PersonService } from './../../../services/person-service';
import {  Component, TemplateRef, ViewChild, ViewEncapsulation, Input  } from '@angular/core';

import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

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


@Component({
  selector: 'app-full-layout-page',
  templateUrl: './person-page.component.html',
  styleUrls: ['./person-page.component.scss'],
  providers: [PersonService]
})
export class PersonPageComponent implements OnInit, OnDestroy  {
  id: number;
  person: any;
  currentPage: any;

  new_role: any;
  editing_kf_name = false;
  editing_kf_ideograms = false;  

  private sub: any;

  constructor(private personService: PersonService, 
              private route: ActivatedRoute, 
              private modalService: NgbModal) {

  }  

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];      
      
      this.load_person_data();      
    });
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

  load_person_data() {
    this.personService.getAllData(this.id).subscribe(
      data => {           
        const result = data.json();    
        this.person = result;     
      }
    );
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

  begin_change_kf_name(){
    this.person.new_kf_name = this.person.kf_name;    
    this.editing_kf_name = true;    
  }

  begin_change_kf_ideograms() {    
    this.person.new_kf_ideograms = this.person.kf_name_ideograms;
    this.editing_kf_ideograms = true;    
  }

  save_kf_name() {
    this.personService.saveKFName(this.id, 
        this.person.new_kf_name || this.person.kf_name, 
        this.person.new_kf_ideograms || this.person.kf_name_ideograms
      ).toPromise().then(() => {
        this.load_person_data();
        this.editing_kf_name = false;
        this.editing_kf_ideograms = false;
      });
  }

  cancel_kf_name() {
    this.editing_kf_name = false;
    this.person.new_kf_name = this.person.kf_name;
  }

  cancel_kf_ideograms() {
    this.editing_kf_ideograms = false;
    this.person.new_kf_ideograms = this.person.kf_name_ideograms;
  }

  showPage(str) {

  }
  
}
