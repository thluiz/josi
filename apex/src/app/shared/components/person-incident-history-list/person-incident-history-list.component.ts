import { zip as observableZip, Subscription, Observable } from 'rxjs';

import { filter } from 'rxjs/operators';
import { CardService } from 'app/services/card-service';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';

import { SecurityService } from 'app/services/security-service';
import { ParameterService, Configurations } from 'app/services/parameter-service';
import { PersonService, ActivityType } from 'app/services/person-service';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ModalType, ModalService } from 'app/services/modal-service';

@Component({
  selector: 'person-incident-history-list',
  templateUrl: './person-incident-history-list.component.html',
  styleUrls: ['../../../../assets/customizations.scss']
})
export class PersonIncidentHistoryListComponent implements OnInit, OnDestroy {
  ActivityTypes = ActivityType;

  items: any[];

  @Input() d: any;
  @Input() person: any;
  @Input() start_date: NgbDateStruct;
  @Input() end_date: NgbDateStruct;
  @Input() activity_type: ActivityType = null;

  private last_call: Date;

  constructor(private modalService: ModalService,
    private parameterService: ParameterService,
    private securityService: SecurityService,
    private cardService: CardService,
    private personService: PersonService) {

    this.set_dates_from_date(new Date());
  }

  set_dates_from_string_date(end_date: string) {
    return this.set_dates_from_date(new Date(end_date));
  }

  set_dates_from_date(end_date: Date) {
    this.end_date = {
      year: end_date.getUTCFullYear(),
      day: end_date.getUTCDate(),
      month: end_date.getUTCMonth() + 1
    }
    this.start_date = this.getLastWeekFromDate(this.end_date);
  }

  private getLastWeekFromDate(date: NgbDateStruct) {
    let last_week = new Date(date.year, date.month, date.day - 7);

    return {
      year: last_week.getUTCFullYear(),
      day: last_week.getUTCDate(),
      month: last_week.getUTCMonth()
    };
  }

  ngOnInit() {
    this.load_items();
  }

  ngOnDestroy() {

  }

  load_items() {
    if (this.last_call != null && ((new Date()).getTime() - (this.last_call.getTime()) <= this.parameterService.getTimeReloadComponents())) {
      return;
    }

    this.personService.getAllIncidentHistory(this.person.id,
      this.start_date, this.end_date, this.activity_type
    ).subscribe((result: any) => {
      this.items = result.data;
    });
  }

  open_new_activity_modal() {
    this.modalService.open(ModalType.AddIncident, {branch_id: this.person.branch_id, 
      people: [ { person_id: this.person.id, 
        name: this.person.name, 
        avatar_url: this.person.avatar_url }]
      }
    );
  }
}