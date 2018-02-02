import { ParameterService } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';

import { Router, ActivatedRoute } from '@angular/router';
import {  Component, TemplateRef, ViewChild, ViewEncapsulation, Input  } from '@angular/core';

import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { FormControl, FormsModule, ReactiveFormsModule,
  FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbModal, 
ModalDismissReasons, 
NgbActiveModal,
NgbDateParserFormatter,
NgbDatepickerI18n,
NgbDatepickerConfig,
NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import { DatePickerI18n, NgbDatePTParserFormatter, 
      PortugueseDatepicker} from 'app/shared/datepicker-i18n';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './person-edit-page.component.html',
  styleUrls: ['./person-edit-page.component.scss'],  
  providers: [DatePickerI18n,
      {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter}, 
      {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class PersonEditPageComponent implements OnInit, OnDestroy  {
  id: number;
  person: any;    
  new_role: any;
  domains: any;
  branches: any;
  programs:any;
  families: any;

  private sub: any;

  constructor(private personService: PersonService,
              private parameterService: ParameterService, 
              private route: ActivatedRoute,
              private router: Router, 
              private modalService: NgbModal,
              private datePickerConfig: NgbDatepickerConfig) {      
    
    datePickerConfig.firstDayOfWeek = 7
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
    if(!program || !this.programs) {
      return;
    }

    this.domains = this.programs.filter(p => p.id == program)[0].domains;
  }

  save_person_data() {
    if(!this.validate_person()) {
      return;
    }

    let p = this.person;
    p.birth_date = this.translate_date_to_server(this.person.birth_date);        
    p.admission_date = this.translate_date_to_server(this.person.admission_date);        
    p.baaisi_date = this.translate_date_to_server(this.person.baaisi_date);  
    p.enrollment_date = this.translate_date_to_server(this.person.enrollment_date);
    p.passport_expiration_date = this.translate_date_to_server(this.person.passport_expiration_date);
              
    this.personService.savePersonData(p).toPromise().then(
      () => {
        this.router.navigateByUrl(`/people/person/${this.id}`);
      }
    )
  }

  validate_person() {    
    this.person.errors = this.person.errors || [];

    this.person.is_valid = true;
    
    if(this.person.branch_id > 0 && (!this.person.program_id || this.person.program_id <= 0)) {
      this.person.errors['need_program'] = true;      
      this.person.is_valid = false;
    } else {
      this.person.errors['need_program'] = false;      
    }

    if(this.person.program_id > 0 && (!this.person.domain_id || this.person.domain_id <= 0)) {      
      this.person.errors['need_domain'] = true;
      this.person.is_valid = false;
    } else {
      this.person.errors['need_domain'] = false;      
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
    this.personService.getData(this.id).subscribe(
      data => {           
        const result = data;    
        this.person = result;  
        this.person.birth_date = this.translate_date_to_view(this.person.birth_date);        
        this.person.admission_date = this.translate_date_to_view(this.person.admission_date);        
        this.person.baaisi_date = this.translate_date_to_view(this.person.baaisi_date);          
        this.person.enrollment_date = this.translate_date_to_view(this.person.enrollment_date);          
        this.person.passport_expiration_date = this.translate_date_to_view(this.person.passport_expiration_date);          
        
        if(!(this.person.is_active_member 
          || this.person.is_disciple 
          || this.person.is_leaving 
          || this.person.is_inactive_member))
          return;

        this.parameterService.getActiveBranches().subscribe((data) => this.branches = data);

        this.parameterService.getKungFuFamilies().subscribe((data) => this.families = data);
        
        this.parameterService.getPrograms().subscribe((data) => { 
            this.programs = data;

            if(this.person.program_id)
              this.domains = this.programs.filter(p => p.id == this.person.program_id)[0].domains;
        });        
      }
    );
  }
}
