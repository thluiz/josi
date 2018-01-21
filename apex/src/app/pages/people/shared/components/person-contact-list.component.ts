import { ParameterService } from './../../../../services/parameter-service';
import { Observable } from 'rxjs/Observable';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input } from '@angular/core';

import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'person-contact-list',
  templateUrl: './person-contact-list.component.html',
  styleUrls: ['../../../../../assets/customizations.scss']
})
export class PersonContactListComponent implements OnInit { 
  contacts: any; 
  new_contact: any = {};
  contact_types = [];

  @Input() d:any;
  @Input() person:any;
  @Input() showHeader = true;

  constructor(private modalService: NgbModal, 
    private parameterService: ParameterService,
    private personService: PersonService) {   

  }

  ngOnInit() {

  }

       
  open(content, incident){   
    this.parameterService.getContactTypes().subscribe(
      (data) => {
        this.contact_types = data.json();

        this.modalService.open(content).result.then((result) => {                                  
        
        }, (reason) => {
            console.log(reason);
        });
      }
    );             
  } 
}