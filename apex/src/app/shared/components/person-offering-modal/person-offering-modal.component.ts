
import { zip as observableZip, Observable, of, Subscription } from 'rxjs';

import { filter, debounceTime, delay, map, distinctUntilChanged, catchError, tap, switchMap } from 'rxjs/operators';

import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { PersonService } from 'app/services/person-service';
import { UtilsService } from 'app/services/utils-service';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Result } from 'app/shared/models/result';


@Component({
  selector: 'person-offering-modal',
  templateUrl: './person-offering-modal.component.html',
  styleUrls: ['../../../../assets/customizations.scss']
})

export class PersonOfferingModalComponent implements OnInit {
  person;
  offers = [];

  @ViewChild('offering_modal') offering_modal: ElementRef;

  private person_changes_subscriber: Subscription;

  constructor(private personService: PersonService,
    private ngbModalService: NgbModal) {
  }

  private person_id() {
    if (!this.person) {
      console.log("person nd");
      return 0;
    }

    return this.person.id || this.person.person_id
  }

  ngOnInit() {
    this.person_changes_subscriber = this.personService.personChanges$.pipe(
      filter((data) => data != null && data.id == this.person_id()))
      .subscribe((data) => {
        this.personService.getPersonAvailableOffering(this.person_id()).subscribe((missing_data) => {
          this.offers = missing_data as any;
        });
      });
  }

  ngOnDestroy() {
    this.person_changes_subscriber.unsubscribe();
  }

  open(person) {
    this.person = person;
    observableZip(
      this.personService.getData(this.person_id()),
      this.personService.getPersonAvailableOffering(this.person_id()),
      (result_person: Result<any>, result_offers: Result<any>) => {
        this.person = result_person.data[0];
        this.offers = result_offers.data;

        this.open_modal(this.offering_modal, true);

      }).subscribe();
  }


  private open_modal(content, on_close_action = false) {
    this.ngbModalService.open(content, { windowClass: 'custom-modal' }).result.then((result) => {

    }, (reason) => {
      console.log(reason);
    });
  }
}
