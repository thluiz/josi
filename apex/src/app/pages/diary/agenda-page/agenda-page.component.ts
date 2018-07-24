import { LightIncident } from 'app/shared/models/incident-model';
import { ApplicationEventService } from 'app/services/application-event-service';
import { SecurityService } from 'app/services/security-service';
import { Component, Input, ViewChild, AfterViewInit, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';

import { PersonService, DailyMonitorDisplayType } from 'app/services/person-service';
import { ParameterService } from 'app/services/parameter-service';
import {
  IncidentService,
  INCIDENT_ADDED,
  INCIDENT_CANCELLED,
  INCIDENT_RESCHEDULED
} from 'app/services/incident-service';

import { FormControl, FormsModule, ReactiveFormsModule,
        FormGroup, Validators, NgForm } from '@angular/forms';

import { NgbModal,
  NgbDateStruct,
  NgbDatepickerI18n,
  NgbDatepickerModule,
  NgbCalendar,
  NgbTimeStruct,
  ModalDismissReasons,
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';

import { Subscription,  Observable } from 'rxjs';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import { filter } from 'rxjs/operators';
import { CurrentActivitiesComponent } from 'app/shared/components/current-activities/current-activities.component';
import { Result } from 'app/shared/models/result';
import { isArray } from 'util';
import { LateralSummaryComponent } from 'app/shared/components/lateral-summary/lateral-summary.component';
import { ModalType, ModalService } from 'app/services/modal-service';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './agenda-page.component.html',
  styleUrls: ['../diary.component.scss'],
  providers: [DatePickerI18n,
    {provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter},
    {provide: NgbDatepickerI18n, useClass: PortugueseDatepicker}]
})
export class AgendaPageComponent implements OnInit, OnDestroy, AfterViewInit {

  agenda;
  show_change_branch;
  current_week = 0;
  current_incident;
  current_branch = 0;
  selected_week;
  new_activity;
  current_branch_name = "Todos os Núcleos";
  branches;
  current_date;
  manual_incident_types;

  @ViewChildren(LateralSummaryComponent)
  lateralSummaryComponent : QueryList<LateralSummaryComponent>;

  @ViewChild(CurrentActivitiesComponent)
  private current_activities : CurrentActivitiesComponent;

  private incidents_subscriber : Subscription;

  constructor(private personService: PersonService,
              private incidentService: IncidentService,
              private parameterService: ParameterService,
              private modalService: ModalService,
              private datePickerConfig: NgbDatepickerConfig,
              private eventManager: ApplicationEventService,
              private securityService: SecurityService) {

    datePickerConfig.firstDayOfWeek = 7
    const date = new Date();

    this.current_date = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    }
  }

  ngAfterViewInit(): void {
  }

  ngOnInit() {
    this.parameterService.getActiveBranches().subscribe(data => {
      const result = data;
      this.branches = result;
    }, err => console.error(err));

    this.parameterService.getIncidentTypes().subscribe(data => {
      const result = data;
      this.manual_incident_types = result.filter(i => !i.automatically_generated);
    }, err => console.error(err));

    this.securityService.getCurrentUserData().subscribe((user) => {
      this.current_branch = user.default_branch_id || 0;
      this.getAgendaData();

      if(this.lateralSummaryComponent) {
        this.lateralSummaryComponent.forEach(ls => {
          ls.branch = this.current_branch;
          ls.getPeopleSummaryData()
        });
      }
    });

    this.incidents_subscriber = this.eventManager
    .event$
    .pipe(filter(
      (result : Result<LightIncident[]>) =>
        result.type == INCIDENT_ADDED || result.type == INCIDENT_RESCHEDULED
    ))
    .subscribe((result : Result<LightIncident[]>) => {
      if(result.type == INCIDENT_RESCHEDULED) {
        const new_incident_date = new Date(result.data[1].date);
        const date = new Date();

        if(new_incident_date.getDate() != date.getDate()
          || new_incident_date.getMonth() != date.getMonth()
          || new_incident_date.getFullYear() != date.getFullYear()) {
            return;
        }
      }

      this.getAgendaData();
    });
  }

  ngOnDestroy() {
    if(this.incidents_subscriber) {
      this.incidents_subscriber.unsubscribe();
    }
  }

  change_current_date(date) {
    this.getAgendaData();
  }

  open_new_person_modal() {
      this.modalService.open(ModalType.AddPerson,
          {
              branch_id: this.current_branch
          });
  }

  open_new_activity_modal() {
      this.modalService.open(ModalType.AddIncident, {
          branch_id: this.current_branch
      });
  }

  branchSelected(id, on_start = false) {
    this.current_branch = id;
    this.show_change_branch = false;

    if(!on_start) {
      this.current_activities.filter_activities(this.current_branch);
    }

    if(this.lateralSummaryComponent) {
      this.lateralSummaryComponent.forEach(ls => {
        ls.branch = this.current_branch;
        ls.getPeopleSummaryData()
      });
    }

    if(this.current_branch == 0) {
      this.current_branch_name = "Todos os Núcleos";
      return;
    }

    const current = this.branches.find((b) => b.id == this.current_branch);
    this.current_branch_name = current.name;
  }

  getAgendaData() {
    this.personService.getDailyAgenda(0, this.current_date).subscribe(
      (result : Result<any>) => {
        this.agenda = isArray(result.data) ? result.data : [];

        this.branchSelected(this.current_branch, true);
      }
    );
  }
}
