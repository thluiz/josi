import { filter } from 'rxjs/operators';
import { Subscription } from "rxjs";
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { PersonService } from 'app/services/person-service';

@Component({
  selector: 'personal-inventory-list',
  templateUrl: './personal-inventory-list.component.html',
  styleUrls: ['../../../../../../assets/customizations.scss']
})
export class PersonalInventoryListComponent implements OnInit, OnDestroy {

  items: any[];

  @Input() person:any;
  @Input() showHeader = true;

  saving = false;
  current_item: any;
  relationship_types  = [];

  errors :string[] = [];
  private last_call : Date;

  private indication_changes_subscriber: Subscription;

  constructor(private modalService: NgbModal,
    private parameterService: ParameterService,
    private personService: PersonService) {
    this.setup_new_relationship();
  }

  ngOnInit() {

    this.indication_changes_subscriber = this.personService.indicationChanges$.pipe(
      filter((data) => data != null && data.person_id == this.person.id))
      .subscribe(() => {
        this.load_items();
      });

    this.load_items();
  }

  ngOnDestroy() {
    this.indication_changes_subscriber.unsubscribe();
  }

  navigateToPerson(person_id) {
    this.person.id = person_id;
    this.load_items();
  }

  load_items() {
    if(this.last_call != null
        && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents()))  {
      return;
    }

    this.personService.getPersonRelationships(this.person.id)
    .subscribe((result : any) => {
      this.items = result.data;
    });

    this.last_call = new Date();
  }

  open(content){
    this.saving = false;
    this.setup_new_relationship();
    this.parameterService.getRelationshipTypes().subscribe(result => {

      this.relationship_types = result;

      this.modalService.open(content).result.then((result2) => {

      }, (reason) => {
        console.log(reason);
      });
    });

  }

  save_new_indication(close_action) {
    this.saving = true;
  }

  remove_relationship(indication) {

  }

  validate_item() {

  }

  private setup_new_relationship() {
    this.current_item = {
      valid: true,
      person2: null,
      person: this.person
    }
  }
}
