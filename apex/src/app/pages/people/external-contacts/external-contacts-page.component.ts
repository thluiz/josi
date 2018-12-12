import { Result } from 'app/shared/models/result';

import {filter} from 'rxjs/operators';
import { CardService } from 'app/services/card-service';
import { ParameterService } from './../../../services/parameter-service';
import { ModalService, ModalType } from 'app/services/modal-service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'app/services/security-service';
import { Card } from 'app/shared/models/card.model';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './external-contacts-page.component.html',
  styleUrls: ['../people-customizations.scss']
})
export class ExternalContactsPageComponent implements OnInit, OnDestroy {
  people: any;
  current_view = 0;
  filters = "1";
  current_branch = 0;
  current_voucher = 0;
  branches: any;
  vouchers: any;
  search_name = "";
  voucher_status = 0;

  private person_list_sub: Subscription;
  private interested_added_subscriber: Subscription;

  constructor(private personService: PersonService,
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private parameterService: ParameterService,
    private cardService: CardService,
    private modalService: ModalService) {

  }

  ngOnInit() {

    this.search_name = this.activatedRoute.snapshot.queryParams["name"] || "";
    this.voucher_status = this.activatedRoute.snapshot.queryParams["voucher_status"] || 0;
    this.current_voucher = this.activatedRoute.snapshot.queryParams["voucher"] || 0;

    this.parameterService.getActiveBranches().subscribe((result_data) => {
      this.branches = result_data.data;
    });

    this.parameterService.getVouchers().subscribe((result : Result<any[]>) => {
      this.vouchers = result.data.filter(d => d.active).sort((a, b) => {
        if(a.order > b.order) return 1;
        if(a.order < b.order) return -1;
        return 0;
      });
    });

    this.securityService.getCurrentUserData()
    .subscribe((result_user : Result<any>) => {
      const user = result_user.data;
      this.current_branch = this.activatedRoute.snapshot.queryParams["branch"]
                            || user.default_branch_id || 0;
    });

    this.interested_added_subscriber = this.personService.personActions$.pipe(
    filter((p) => p.data != null
      && p.data.is_interested
      && (!this.current_branch || p.data.branch_id == this.current_branch)))
    .subscribe((next) => {
      this.load_voucher_list();
    });

    if(this.voucher_status > 0
      || this.branches > 0
      || this.current_voucher > 0
      || (this.search_name && this.search_name.length > 0)
    )
      this.load_voucher_list();
  }

  ngOnDestroy() {
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    if(this.interested_added_subscriber) {
      this.interested_added_subscriber.unsubscribe();
    }
  }

  filter_people() {
    this.router.navigateByUrl(`people/external_contacts?branch=${this.current_branch}&name=${this.search_name}&voucher=${this.current_voucher}&voucher_status=${this.voucher_status}`);
    this.load_voucher_list();
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.filter_people();
    }
  }

  open_incident(id) {
    if(id > 0) {
      this.modalService.open(ModalType.IncidentTreatment, { id } as any);
    }
  }

  open_new_person_modal() {
    this.modalService.open(ModalType.AddPerson, null);
  }

  open_card_details(card_id) {
    this.cardService.getCardData(card_id).subscribe((result_card : Result<Card[]>) => {
      this.modalService.open(ModalType.DetailTask, result_card.data[0]);
    });
  }

  load_voucher_list() {
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService.getExternalContactsList(this.current_branch, this.search_name, this.current_voucher, this.voucher_status).subscribe(
      (result : any)=> {
        this.people = result.data;
      }
    );
  }
}
