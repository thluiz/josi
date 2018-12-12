import { PersonService } from 'app/services/person-service';
import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { zip as observableZip, Observable, of } from 'rxjs';
import { debounceTime, delay, map, distinctUntilChanged, catchError, tap, switchMap } from 'rxjs/operators';

import { IncidentService } from 'app/services/incident-service';

import { Ownership } from 'app/shared/models/ownership';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'change-ownership-modal',
  templateUrl: './change-ownership-modal.component.html',
  styleUrls: ["./change-ownership-modal.scss"]
})
export class ChangeOwnershipModalComponent {
  ownership: Ownership;
  description: string;

  saving = false;
  searching_people = false;
  search_failed = false;

  owner: any;
  first_surrogate: any;
  second_surrogate: any;

  @ViewChild('content') modal: ElementRef;

  constructor(private incidentService: IncidentService,
    private ngbModalService: NgbModal,
    private personService: PersonService,
    private toastrServoce: ToastrService) {
  }

  open(parameters : {ownership: Ownership }) {
    this.ownership = parameters.ownership;
    this.first_surrogate = null;
    this.second_surrogate = null;
    this.description = null;

    this.incidentService.getOwnershipDataForChange(this.ownership)
    .subscribe((result_data : Result<any[]>) => {
      let data = result_data.data[0]

      this.owner = {
        id: this.ownership.person_id,
        name: this.ownership.person_name
      };

      if(data.first_surrogate) {
        this.first_surrogate = {
          id: data.first_surrogate[0].person_id,
          name: data.first_surrogate[0].person_name
        };
      }

      if(data.second_surrogate) {
        this.second_surrogate = {
          id: data.second_surrogate[0].person_id,
          name: data.second_surrogate[0].person_name
        };
      }

      this.ngbModalService.open(this.modal)
      .result.then((result) => {

      }, (reason) => {
        console.log(reason);
      });
    });
  }

  save(close_action: () => void) {
    if(!this.owner) {
      this.toastrServoce.error("Informe o titular");
      return;
    }

    if(!this.description || this.description.length < 3) {
      this.toastrServoce.error("Informe o motivo da troca");
      return;
    }

    this.saving = true;

    this.incidentService.changeOwnership(
      this.ownership, {
        id: this.owner.id || this.owner.person_id
      }, {
        id: this.first_surrogate ?
        (this.first_surrogate.id || this.first_surrogate.person_id) : null
      }, {
        id: this.second_surrogate ?
        (this.second_surrogate.id || this.second_surrogate.person_id) : null
      },
      this.description
    ).subscribe(result => {
      this.saving = false;
      if(!result.success) {
        this.toastrServoce.error(result.message);
        return;
      }
      close_action();
    });
  }

  switch_ownership_first_surrogate() {
    const old_owner = Object.assign({}, this.owner);
    this.owner = this.first_surrogate;
    this.first_surrogate = old_owner;
  }

  take_ownership_first_surrogate() {
    this.owner = this.first_surrogate;
    this.first_surrogate = null;
  }

  take_ownership_second_surrogate() {
    this.owner = this.second_surrogate;
    this.second_surrogate = null;
  }


  people_typeahead_formatter = (x) => x.name;

  search_people = (text$: Observable<string>) =>
      text$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          tap(() => this.searching_people = true),
          switchMap(term =>
              this.personService.search(term).pipe(
                  map(response => {
                      return <string[]>response;
                  }),
                  tap(() => this.search_failed = false),
                  catchError(() => {
                      this.search_failed = true;
                      return of([]);
                  }), )),
          tap(() => this.searching_people = false), )

}
