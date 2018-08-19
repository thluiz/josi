import { PersonService } from 'app/services/person-service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { ModalService, ModalType } from 'app/services/modal-service';

import { Subscription } from 'rxjs';
import { Result } from 'app/shared/models/result';
import { SecurityService } from 'app/services/security-service';

@Component({
  selector: 'lateral-summary',
  templateUrl: './lateral-summary.component.html',
  styleUrls: ['./lateral-summary.scss'],
})
export class LateralSummaryComponent implements OnInit, OnDestroy {
    summary: any = [];
    @Input() branch = 0;
    @Input() week;
    people_summary_cols = [];
    people_summary;

    private update_summary_timer;

    constructor(private personService: PersonService, private securityService: SecurityService) {

    }

    ngOnInit() {
      this.people_summary_cols = [
        { width: "88%", name: "Panorama" },
        { width: "3%", icon: "fa fa-user", description: "Membros" },
        { width: "3", icon: "ft-calendar", description: "Agendamento" },
        { width: "3%", icon: "icon-wallet", description: "Financeiro" },
        { width: "3%", icon: "far fa-envelope", description: "Comunicados" }
      ];

      if(this.branch) {
        this.getPeopleSummaryData();
      } else {
        this.securityService.getCurrentUserData()
        .subscribe((result_user : Result<any>) => {
          this.branch = result_user.data.default_branch_id;
          this.getPeopleSummaryData();
        });
      }
    }

    ngOnDestroy() {
      if(this.update_summary_timer) {
        clearTimeout(this.update_summary_timer);
      }
    }

    getPeopleSummaryData() {
      let current_date = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate()
      };

      this.personService.getPeopleSummary(this.branch, this.week || 0)
      .subscribe(
        (result : Result<any[]>) => {
        console.log(result);
        const data = result.data as any;

        this.people_summary = data.people_summary;
      },
      err => console.error(err)
      );

      var d = new Date();
      var hours = d.getHours();

      const update_interval = hours >= 22 || hours < 6 ? 600000 : 300000;

      if(this.update_summary_timer) {
        clearTimeout(this.update_summary_timer);
      }

      this.update_summary_timer = setTimeout(() => { this.getPeopleSummaryData() }, update_interval);
    }
}
