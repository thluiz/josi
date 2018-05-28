import { Observable } from 'rxjs';

import { Component, Input, OnInit } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { ParameterService } from 'app/services/parameter-service';

@Component({
  selector: 'new-contact-form',
  templateUrl: './new-contact-form.component.html',
  styleUrls: ['../../../../assets/customizations.scss']
})

export class NewContactFormComponent implements OnInit {    
  contact_types;
  new_contact :any = { principal: 0 };

  @Input("person") person : any;
  @Input() afterSave: () => void;
  @Input() cancelAction: () => void;
  @Input() defaultPrincipal = false;

  constructor(private personService: PersonService, private parameterService: ParameterService) {

  }

  ngOnInit() {
    this.parameterService.getContactTypes().subscribe(
    (data) => {
      this.contact_types = data;
    }, (reason) => {
        console.log(reason);
    });
    this.new_contact.principal = this.defaultPrincipal ? 1 : 0;
  } 
  
  get_details_and_validate() {
    const contact_type = this.contact_types.find((ct) => ct.id == this.new_contact.contact_type);
    this.new_contact.contact_helper_text = contact_type.helper_text;
    this.new_contact.contact_placeholder = contact_type.placeholder;
    
    this.validate_new_contact();
  }

  validate_new_contact() {
    this.new_contact.is_valid = false;
    if(this.new_contact.contact_type <= 0
      || !this.new_contact.contact
      || this.new_contact.contact.length <= 0)
      return;

    if(this.new_contact.contact.indexOf("http") >= 0
      || this.new_contact.contact.indexOf("fb") >= 0
      || this.new_contact.contact.indexOf("facebook") >= 0
      || this.new_contact.contact.indexOf("instagram") >= 0
      || this.new_contact.contact.indexOf("twitter") >= 0)
        return;     

    this.new_contact.is_valid = true;
  }           

  save_contact() {
    this.personService.savePersonContact(this.person.id, 
      this.new_contact.contact_type, this.new_contact.contact, 
      this.new_contact.details, this.new_contact.principal)
      .subscribe((data) => {
        if(this.afterSave) {
          this.afterSave();
        }
      });    
  }
}