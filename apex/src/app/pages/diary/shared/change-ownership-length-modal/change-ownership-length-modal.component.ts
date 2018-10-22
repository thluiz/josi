import { UtilsService } from 'app/services/utils-service';
import { PersonService } from './../../../../services/person-service';
import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal, NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import { IncidentService } from 'app/services/incident-service';

import { Ownership } from 'app/shared/models/ownership';
import { Result } from 'app/shared/models/result';
import { Observable } from 'rxjs';

@Component({
  selector: 'change-ownership-length-modal',
  templateUrl: './change-ownership-length-modal.component.html',
  styleUrls: ["./change-ownership-length-modal.scss"]
})
export class ChangeOwnershipLengthModalComponent {
  ownership: Ownership;

  incidents_to_be_reschudeled = [];
  incidents_to_be_incorporated = [];
  actions_to_be_incorporated = [];
  actions_to_be_rescheduled = [];

  ownerships_to_be_cancelled = [];
  ownerships_to_be_delayed = [];
  actions_to_be_delayed = [];

  saving = false;

  @ViewChild('content') modal: ElementRef;

  constructor(private incidentService: IncidentService,
    private ngbModalService: NgbModal,
    private utilsService: UtilsService,
    private personService: PersonService,
    private toastrServoce: ToastrService) {
  }

  open(parameters : {ownership: Ownership }) {
    this.ownership = parameters.ownership;

    this.ngbModalService.open(this.modal)
    .result.then((result) => {

    }, (reason) => {
      console.log(reason);
    });
  }

  save(close_action: () => void) {
    if(!this.ownership["tmp_date"] || !this.ownership["tmp_time"]
    || !this.ownership["tmp_end_date"] || !this.ownership["tmp_end_time"]) {
      this.toastrServoce.error("Informe a data de início e fim");
      return;
    }
    this.saving = true;
    this.incidentService.changeOwnershipLength(
      this.ownership, this.utilsService.translate_date_time_to_server(
        this.ownership["tmp_date"], this.ownership["tmp_time"]
      ),
      this.utilsService.translate_date_time_to_server(
        this.ownership["tmp_end_date"], this.ownership["tmp_end_time"]
      )
    ).subscribe(result => {
      this.saving = false;
      if(!result.success) {
        this.toastrServoce.error(result.message);
        return;
      }
      close_action();
    });
  }

  loadChangeOwnershipData(_event?) {
    const dt = new Date(this.ownership.date);
    const dtEnd = new Date(this.ownership.end_date);

    const start_date: NgbDateStruct = {
      year: dt.getUTCFullYear(),
      month: dt.getUTCMonth() + 1,
      day: dt.getUTCDate()
    };

    const end_date: NgbDateStruct = {
      year: dtEnd.getUTCFullYear(),
      month: dtEnd.getUTCMonth() + 1,
      day: dtEnd.getUTCDate()
    };

    const start_time: NgbTimeStruct = {
      hour: dt.getHours(),
      minute: dt.getUTCMinutes(),
      second: 0
    };

    const end_time: NgbTimeStruct = {
      hour: dtEnd.getHours(),
      minute: dtEnd.getUTCMinutes(),
      second: 0
    };

    this.ownership["tmp_date"] = start_date;
    this.ownership["tmp_time"] = start_time;
    this.ownership["tmp_end_date"] = end_date;
    this.ownership["tmp_end_time"] = end_time;

    Observable.zip(
      this.incidentService.getDataForChangeOwnershipLength(this.ownership,
      this.utilsService.translate_date_time_to_server(this.ownership["tmp_date"],
        this.ownership["tmp_time"]),
      this.utilsService.translate_date_time_to_server(this.ownership["tmp_end_date"],
        this.ownership["tmp_end_time"]),
      ),
      (result_ownership : Result<any[]>) => {
          let data = result_ownership.data[0];

          this.incidents_to_be_reschudeled = data.incidents_to_be_reschudeled || [];
          this.incidents_to_be_incorporated = data.incidents_to_be_incorporated || [];

          this.actions_to_be_rescheduled = data.actions_to_be_rescheduled || [];
          this.actions_to_be_incorporated = data.actions_to_be_incorporated || [];

          this.ownerships_to_be_cancelled = data.ownerships_to_be_cancelled || [];
          this.ownerships_to_be_delayed = data.ownerships_to_be_delayed || [];

      }
    ).subscribe();
  }
}
