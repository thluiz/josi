import { Router, ActivatedRoute } from '@angular/router';
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
  templateUrl: './person-edit-page.component.html',
  styleUrls: ['./person-edit-page.component.scss'],  
  providers: [PersonService]
})
export class PersonEditPageComponent implements OnInit, OnDestroy  {
  id: number;
  person: any;    
  new_role: any;
  domains: any;

  private sub: any;

  constructor(private personService: PersonService, 
              private route: ActivatedRoute,
              private router: Router, 
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

  change_program(program) {   
    if(!program || !this.person.programs) {
      return;
    }

    this.domains = this.person.programs.filter(p => p.id == program)[0].domains;
  }

  save_person_data() {
    if(!this.validate_person()) {
      return;
    }

    let p = this.person;
    p.birth_date = this.translate_date_to_server(this.person.birth_date);        
    p.admission_date = this.translate_date_to_server(this.person.admission_date);        
    p.baaisi_date = this.translate_date_to_server(this.person.baaisi_date);  
        
    this.personService.savePersonData(p).toPromise().then(
      () => {
        this.router.navigateByUrl(`person/${this.id}`);
      }
    )
  }

  validate_person() {    
    this.person.errors = this.person.errors || [];

    this.person.is_valid = true;
    
    if(this.person.branch_id > 0 && (!this.person.program_id || this.person.program_id <= 0)) {
      this.person.errors['need_program'] = true;      
      this.person.is_valid = false;
    }

    if(this.person.program_id > 0 && (!this.person.domain_id || this.person.domain_id <= 0)) {      
      this.person.errors['need_domain'] = true;
      this.person.is_valid = false;
    }

    if(this.person.is_valid) {
      this.person.errors = [];      
      return true;
    }
    
    return false;
  }

  private translate_date_to_view(date) {      
    if(!date || date.split("-").length != 3) {
      return null;
    }
    const splitted_date = date.split("-");

    return {
      year: parseInt(splitted_date[0], 10),
      month: parseInt(splitted_date[1], 10),
      day: parseInt(splitted_date[2], 10)
    }
  }

  private translate_date_to_server(date) {
    if(!date || !date.year)
      return null;

    return `${date.year}-${date.month}-${date.day}`;
  }

  load_person_data() {
    this.personService.getAllData(this.id).subscribe(
      data => {           
        const result = data.json();    
        this.person = result;  
        this.person.birth_date = this.translate_date_to_view(this.person.birth_date);        
        this.person.admission_date = this.translate_date_to_view(this.person.admission_date);        
        this.person.baaisi_date = this.translate_date_to_view(this.person.baaisi_date);  
        
        if(!this.person.programs || !this.person.program_id || this.person.program_id <= 0) {
          return;
        }

        this.domains = this.person.programs.filter(p => p.id == this.person.program_id)[0].domains;
      }
    );
  }
}
