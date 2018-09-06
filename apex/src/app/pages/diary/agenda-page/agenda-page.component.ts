import { ToastrService } from "ngx-toastr";
import { LightIncident } from "app/shared/models/incident-model";
import { ApplicationEventService } from "app/services/application-event-service";
import { SecurityService } from "app/services/security-service";
import {
  Component,
  AfterViewInit,
  OnInit,
  OnDestroy,
  ViewChildren,
  QueryList
} from "@angular/core";

import { PersonService } from "app/services/person-service";
import { ParameterService } from "app/services/parameter-service";
import { UtilsService } from "app/services/utils-service";

import {
  IncidentService,
  INCIDENT_ADDED,
  INCIDENT_CANCELLED,
  INCIDENT_RESCHEDULED,
  OWNERSHIP_MIGRATED
} from "app/services/incident-service";

import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  Validators,
  NgForm
} from "@angular/forms";

import {
  NgbModal,
  NgbDateStruct,
  NgbDatepickerI18n,
  NgbDatepickerModule,
  NgbCalendar,
  NgbTimeStruct,
  ModalDismissReasons,
  NgbActiveModal,
  NgbDatepickerConfig,
  NgbDateParserFormatter
} from "@ng-bootstrap/ng-bootstrap";

import { Subscription, Observable } from "rxjs";
import {
  DatePickerI18n,
  NgbDatePTParserFormatter,
  PortugueseDatepicker
} from "app/shared/datepicker-i18n";

import { filter } from "rxjs/operators";
import { CurrentActivitiesComponent } from "app/shared/components/current-activities/current-activities.component";
import { Result } from "app/shared/models/result";
import { isArray } from "util";
import { LateralSummaryComponent } from "app/shared/components/lateral-summary/lateral-summary.component";
import { ModalType, ModalService } from "app/services/modal-service";
import { Ownership } from "app/shared/models/ownership";
import { Location } from "app/shared/models/location.model";
import { GroupByPipe } from "ngx-pipes";

@Component({
  selector: "app-full-layout-page",
  templateUrl: "./agenda-page.component.html",
  styleUrls: ["../diary.component.scss"],
  providers: [
    GroupByPipe,
    DatePickerI18n,
    { provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter },
    { provide: NgbDatepickerI18n, useClass: PortugueseDatepicker }
  ]
})
export class AgendaPageComponent implements OnInit, OnDestroy, AfterViewInit {
  ownerships: Ownership[] = [];
  not_migrated_ownerships: Ownership[] = [];
  incidents : LightIncident[] = [];
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
  saving = false;

  im_locations: Location[] = [];
  branch_locations: Location[] = [];
  incidents_without_ownership : LightIncident[] = [];


  migrating_ownership: Ownership;

  @ViewChildren(LateralSummaryComponent)
  lateralSummaryComponent: QueryList<LateralSummaryComponent>;

  @ViewChildren(CurrentActivitiesComponent)
  private current_activities: QueryList<CurrentActivitiesComponent>;

  private incidents_subscriber: Subscription;

  constructor(
    private personService: PersonService,
    private parameterService: ParameterService,
    private incidentService: IncidentService,
    private modalService: ModalService,
    private datePickerConfig: NgbDatepickerConfig,
    private eventManager: ApplicationEventService,
    private securityService: SecurityService,
    private utilsService: UtilsService,
    private ngbModalService: NgbModal,
    private toastrService: ToastrService
  ) {
    datePickerConfig.firstDayOfWeek = 7;
    const date = new Date();

    this.current_date = {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear()
    };
  }

  ngAfterViewInit(): void {}

  ngOnInit() {
    this.parameterService.getActiveBranches().subscribe(
      result_data => {
        const result = result_data.data;
        this.branches = result;
      },
      err => console.error(err)
    );

    this.securityService
      .getCurrentUserData()
      .subscribe((result_user: Result<any>) => {
        this.current_branch = result_user.data.default_branch_id || 0;
        this.getAgendaData();

        if (this.lateralSummaryComponent) {
          this.lateralSummaryComponent.forEach(ls => {
            ls.branch = this.current_branch;
            ls.getPeopleSummaryData();
          });
        }
      });

    this.incidents_subscriber = this.eventManager.event$
      .pipe(
        filter(
          (result: Result<LightIncident[]>) =>
            result.type == INCIDENT_ADDED ||
            result.type == INCIDENT_RESCHEDULED ||
            result.type == OWNERSHIP_MIGRATED
        )
      )
      .subscribe((result: Result<LightIncident[]>) => {
        if (result.type == INCIDENT_RESCHEDULED) {
          const new_incident_date = new Date(result.data[1].date);
          const date = new Date();

          if (
            new_incident_date.getDate() != date.getDate() ||
            new_incident_date.getMonth() != date.getMonth() ||
            new_incident_date.getFullYear() != date.getFullYear()
          ) {
            return;
          }
        }

        if(result.type == INCIDENT_ADDED && result.data.filter(i => !i.ownership_id).length == 0) {
          return;
        }

        this.getAgendaData();
      });
  }

  open_migrate_ownership(ownership: Ownership, migrate_ownership_modal) {
    this.migrating_ownership = ownership;
    const dt = new Date(ownership.date);

    const end_date: NgbDateStruct = {
      year: dt.getUTCFullYear(),
      month: dt.getUTCMonth() + 1,
      day: dt.getUTCDate()
    };

    const end_time: NgbTimeStruct = {
      hour: dt.getHours() + 1,
      minute: dt.getUTCMinutes(),
      second: 0
    };

    this.migrating_ownership["tmp_end_date"] = end_date;
    this.migrating_ownership["tmp_end_time"] = end_time;

    Observable.zip(
      this.parameterService.getActiveLocations(),
      (result_locations : Result<Location[]>) => {
        if(result_locations.success) {
          this.im_locations = result_locations.data.filter(l => l.branch == null);
          this.branch_locations = result_locations.data.filter(l => l.branch != null);
        }

        this.loadIncidentsWithoutOwnership(() => {
          this.saving = false;
          this.open_modal(migrate_ownership_modal);
        });
      }
    ).subscribe();
  }

  loadIncidentsWithoutOwnership(on_load? : () => void) {
    this.incidentService.getIncidentsWithoutOwnership(
      this.migrating_ownership.branch_id,
      this.migrating_ownership.location_id,
      this.migrating_ownership.date,
      this.utilsService.translate_date_time_to_server(
        this.migrating_ownership["tmp_end_date"],
        this.migrating_ownership["tmp_end_time"]
      ),
    ).subscribe((incidents_without_ownership : Result<LightIncident[]>) => {
      if(!incidents_without_ownership.success) {
        this.toastrService.error(incidents_without_ownership.message);
        return;
      }
      this.incidents_without_ownership = incidents_without_ownership.data.map(iwo => {
        iwo['should_migrate'] = true;
        return iwo;
      });

      if(on_load) {
        on_load();
      }
    })
  }

  change_migrating_ownership_branch() {
    this.migrating_ownership.location_id = null;
    if(this.migrating_ownership.branch_id) {
      const locations = this.branch_locations
      .filter(l => l.branch.id == this.migrating_ownership.branch_id);

      if(locations.length == 1) {
        this.migrating_ownership.location_id = locations[0].id;
      }

      return;
    }

    if(this.im_locations.length == 1) {
      this.migrating_ownership.location_id = this.im_locations[0].id;
    }
  }

  compareFn(a, b) {
    if(!a || !b || !a.id || !b.id)
      return false;

    return a.id == b.id;
  }

  migrate_ownership(close_action) {
    if(!this.migrating_ownership.location_id) {
      this.toastrService.error("Informe o local da titularidade");
      return;
    }

    if(!this.migrating_ownership['tmp_end_time']) {
      this.toastrService.error("Informe o horário de fim da titularidade");
      return;
    }

    this.saving = true;

    this.migrating_ownership.end_date = this.utilsService.translate_date_time_to_server(
      this.migrating_ownership["tmp_end_date"],
      this.migrating_ownership["tmp_end_time"]
    );

    this.incidentService
      .migrateOwnership(
        this.migrating_ownership,
        this.incidents_without_ownership.filter(iwo => iwo['should_migrate'])
      )
      .subscribe((result_data: Result<any>) => {
        this.saving = false;

        if (!result_data.success) {
          this.toastrService.error(result_data.message);
          return;
        }

        close_action();
        this.getAgendaData();
      });
  }

  private open_modal(content, on_close_action?: () => void) {
    let modalRef = this.ngbModalService.open(content);

    modalRef.result.then(
      () => {},
      reason => {
        console.log(reason);

        if (on_close_action) {
          on_close_action();
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.incidents_subscriber) {
      this.incidents_subscriber.unsubscribe();
    }
  }

  change_current_date(date) {
    this.getAgendaData();
  }

  open_new_person_modal() {
    this.modalService.open(ModalType.AddPerson, {
      branch_id: this.current_branch
    });
  }

  branchSelected(id, on_start = false) {
    this.current_branch = id;
    this.show_change_branch = false;

    if (this.lateralSummaryComponent) {
      this.current_activities.forEach(ca => {
        ca.branch = this.current_branch;
        ca.filter_activities(this.current_branch);
      });
    }

    if (this.lateralSummaryComponent) {
      this.lateralSummaryComponent.forEach(ls => {
        ls.branch = this.current_branch;
        ls.getPeopleSummaryData();
      });
    }

    if (this.current_branch == 0) {
      this.current_branch_name = "Todos os Núcleos";
      return;
    }

    const current = this.branches.find(b => b.id == this.current_branch);
    this.current_branch_name = current.name;
    this.getAgendaData();
  }

  getAgendaData() {
    this.personService
      .getDailyAgenda(this.current_branch, this.current_date)
      .subscribe((result: Result<any>) => {
        if (!isArray(result.data)) {
          return;
        }

        const data = result.data[0];

        if (!isArray(data.ownerships)) {
          data.ownerships = [];
        }

        if (!isArray(data.incidents)) {
          data.incidents = [];
        }

        this.ownerships = (data.ownerships as Ownership[]).filter(
          o => o.end_date != null
        );

        this.not_migrated_ownerships = (data.ownerships as Ownership[]).filter(
          o => o.end_date == null
        );

        this.incidents = data.incidents;
      });
  }
}
