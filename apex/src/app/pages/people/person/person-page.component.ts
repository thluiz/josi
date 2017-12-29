import { ActivatedRoute } from '@angular/router';
import { PersonService } from './../../../services/person-service';
import {  Component, TemplateRef, ViewChild, ViewEncapsulation, Input  } from '@angular/core';

import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { FormControl, FormsModule, ReactiveFormsModule,
  FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbModal, 
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
  new_role: any;

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
      }
    );
  }

  showPage(str) {

  }  
}
