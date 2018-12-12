import { UtilsService } from './../../../services/utils-service';
import { LightIncident } from './../../models/incident-model';
import { ToastrService } from 'ngx-toastr';
import { IncidentAction } from 'app/shared/models/incident-action-model';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Component, ElementRef, ViewChild } from '@angular/core';

import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';

import { NgbDateParserFormatter, NgbDatepickerI18n, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IncidentService } from 'app/services/incident-service';
import { Ownership } from 'app/shared/models/ownership';


@Component({
  selector: 'incident-action-treatment-modal',
  templateUrl: './incident-action-treatment-modal.component.html',
  styleUrls: ["./incident-action-treatment-modal.scss"],
  providers: [DatePickerI18n,
    { provide: NgbDateParserFormatter, useClass: NgbDatePTParserFormatter },
    { provide: NgbDatepickerI18n, useClass: PortugueseDatepicker }]
})
export class IncidentActionTreatmentModalComponent {
  incidentAction: IncidentAction;
  incident: LightIncident;

  saving = false;

  treatment_type: number;
  treatment_until_date: NgbDateStruct;
  treatment_until_time: NgbTimeStruct;
  treatment_description: string;
  errors : string[] = [];

  @ViewChild('content') incident_treatment_modal: ElementRef;

  constructor(private datePickerConfig: NgbDatepickerConfig,
    private incidentService: IncidentService,
    private ngbModalService: NgbModal,
    private toastrServoce: ToastrService,
    private utilsService: UtilsService) {

    datePickerConfig.firstDayOfWeek = 7
  }

  open(parameters : {action: IncidentAction, incident: LightIncident }) {
    this.incidentAction = parameters.action;
    this.incident = parameters.incident;

    this.ngbModalService.open(this.incident_treatment_modal)
    .result.then((result) => {

    }, (reason) => {
      console.log(reason);
    });
  }

  treat_action(close_action) {
    this.validate();

    if(this.errors.length > 0) {
      this.errors.forEach(e => {
        this.toastrServoce.error(e);
      });
      return;
    }

    this.saving = true;
    this.incidentService.treatAction({
      action_id: this.incidentAction.id,
      incident_id: this.incident ? this.incident.id : null,
      treatment_date: this.utilsService.translate_date_time_to_server(
        this.treatment_until_date, this.treatment_until_time
      ),
      treatment_type: this.treatment_type,
      treatment_description: this.treatment_description
    }).subscribe(() => {
      this.saving = false;
      if(close_action) {
        close_action();
      }
    });
  }

  validate() {
    this.errors = [];
    if(!this.treatment_type || this.treatment_type <= 0) {
      this.errors.push("Escolha para quando o tratamento deve ser retomado")
    }

    if(this.treatment_type == 2 && !this.treatment_until_date) {
      this.errors.push("Informe quando os titulares devem retomar a ação");
    }

    if(this.treatment_type == 2 && !this.treatment_until_time) {
      this.errors.push("Informe o horário em que os titulares devem retomar a ação");
    }

    if(!this.treatment_description || this.treatment_description.length < 5) {
      this.errors.push("Informe o tratamento e a próxima ação a ser realizada");
    }
  }
}
