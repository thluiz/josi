import { isArray } from 'util';
import { zip as observableZip, Subscription, Observable } from 'rxjs';

import { filter } from 'rxjs/operators';
import { CardService } from 'app/services/card-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { SecurityService } from 'app/services/security-service';
import { ParameterService, Configurations } from 'app/services/parameter-service';
import { PersonService, ActivityType } from 'app/services/person-service';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ModalType, ModalService } from 'app/services/modal-service';
import { LightIncident } from '../../models/incident-model';

@Component({
  selector: 'person-incident-history-list',
  templateUrl: './person-incident-history-list.component.html',
  styleUrls: ['../../../../assets/customizations.scss']
})
export class PersonIncidentHistoryListComponent implements OnInit, OnDestroy {
  ActivityTypes = ActivityType;

  items: any[] = [];

  @Input() d: any;
  @Input() person: any;
  @Input() current: LightIncident;
  @Input() start_date: NgbDateStruct;
  @Input() end_date: NgbDateStruct;
  @Input() activity_type: ActivityType = null;

  show_full_history = false;

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
    this.show_full_history = false;
    this.load_items();
  }

  ngOnDestroy() {

  }

  toggle_full_history() {
    this.show_full_history = !this.show_full_history;
  }

  load_items() {
    let start = new Date(this.start_date.year, this.start_date.month - 1, this.start_date.day).getTime();
    let end = new Date(this.end_date.year, this.end_date.month - 1, this.end_date.day).getTime();
    let current_date_time = new Date();
    let current_date = new Date(current_date_time.getFullYear(),
                            current_date_time.getMonth(), current_date_time.getDate()).getTime();

    let last_week = new Date(current_date_time.getFullYear(), current_date_time.getMonth(), current_date_time.getDate() - 7).getTime();

    if(start < last_week || current_date < start || current_date > end) {
      this.show_full_history = true;
    }

    this.personService.getAllIncidentHistory(this.person.id,
      this.start_date, this.end_date, this.activity_type
    ).subscribe((result: any) => {
      if(isArray(result.data))
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
