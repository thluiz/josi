
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalService, ModalType } from 'app/services/modal-service';
import { Subscription } from 'rxjs';
import { PersonService } from 'app/services/person-service';

@Component({
  selector: 'person-status-line',
  templateUrl: './person-status-line.component.html'
})

export class PersonStatusLineComponent implements OnInit {  

  @Input() person: any;  

  private person_changes_subscriber: Subscription;  

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private modalService: ModalService,
    private personService: PersonService) {
            
  }

  ngOnInit() {
    this.person_changes_subscriber = this.personService.personChanges$
      .filter((p) => p.id == this.person.id)
      .subscribe((person) => {  
        console.log(person);         
        this.person = person;        
      });
  }

  ngOnDestroy() {
    this.person_changes_subscriber.unsubscribe();
  }

  begin_person_data_treatment() {    
    this.modalService.open(ModalType.PersonTreatment, this.person);    
  }
}