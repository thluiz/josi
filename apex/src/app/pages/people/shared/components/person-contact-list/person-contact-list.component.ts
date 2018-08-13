import { Result } from 'app/shared/models/result';

import {filter} from 'rxjs/operators';

import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ParameterService } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'person-contact-list',
  templateUrl: './person-contact-list.component.html',
  styleUrls: ['../../../../../../assets/customizations.scss']
})
export class PersonContactListComponent implements OnInit, OnDestroy {

  contacts: any;

  @Input() d:any;
  @Input() person:any;
  @Input() showHeader = true;
  @Input() showOnlyPrincipal = false;
  @Input() showDelete = true;

  private contact_changes_subscriber: Subscription;
  private last_call : Date;

  constructor(private modalService: NgbModal,
    private parameterService: ParameterService,
    private personService: PersonService) {

  }

  ngOnInit() {
    this.contact_changes_subscriber = this.personService.contactChanges$.pipe(
      filter((data) => data != null && data.person_id == this.person.id))
      .subscribe((data) => {
        this.load_contacts();
      });

    this.load_contacts();
  }

  ngOnDestroy() {
    this.contact_changes_subscriber.unsubscribe();
  }

  load_contacts() {
    if(this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents()))  {
      return;
    }

    this.personService.getPersonContacts(this.person.id, this.showOnlyPrincipal)
    .subscribe((result_data : Result<any>) => this.contacts = result_data.data);

    this.last_call = new Date();
  }

  open(content){
    this.parameterService.getContactTypes().subscribe((data) => {
      this.modalService.open(content).result.then((result) => {

      }, (reason) => {
          console.log(reason);
      });
    });
  }

  remove_contact(contact) {
    this.personService.removePersonContact(this.person.id, contact.id).subscribe();
  }
}
