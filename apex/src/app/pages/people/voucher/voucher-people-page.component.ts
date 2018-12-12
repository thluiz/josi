import { Result } from 'app/shared/models/result';

import {filter} from 'rxjs/operators';
import { CardService } from 'app/services/card-service';
import { ParameterService } from './../../../services/parameter-service';
import { ModalService, ModalType } from 'app/services/modal-service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonService } from 'app/services/person-service';
import { DatePickerI18n, NgbDatePTParserFormatter, PortugueseDatepicker } from 'app/shared/datepicker-i18n';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'app/services/security-service';
import { Card } from 'app/shared/models/card.model';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './voucher-people-page.component.html',
  styleUrls: ['../people-customizations.scss']
})
export class VoucherPeoplePageComponent implements OnInit, OnDestroy {
  people: any;
  all_people: any;
  current_view = 0;
  filters = "1";
  current_branch = 0;
  current_voucher = 0;
  branches: any;
  vouchers: any;
  search_name = "";

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
    this.parameterService.getActiveBranches()
    .subscribe((result : Result<any[]>) => {
      this.branches = result.data;
    });

    this.parameterService.getVouchers()
    .subscribe((result : Result<any[]>) => {
      this.vouchers = result.data;
    });

    this.securityService.getCurrentUserData()
    .subscribe((result_user : Result<any>) => {
      this.current_branch = this.activatedRoute.snapshot.queryParams["branch"]
                              || result_user.data.default_branch_id || 0;

      this.load_voucher_list();
    });

    this.interested_added_subscriber = this.personService
    .personActions$.pipe(
    filter((p) => p.data != null && p.data.is_interested && (!this.current_branch || p.data.branch_id == this.current_branch)))
    .subscribe(() => {
      this.load_voucher_list();
    });

  }

  ngOnDestroy() {
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }
  }

  apply_filters() {
    let people = this.all_people;

    if(this.current_branch > 0) {
      people = people.filter((p : any) => {
        return p.branch_id == this.current_branch;
      });
    }

    this.people = people;
  }

  filter_people() {
    this.router.navigateByUrl(`people/voucher?branch=${this.current_branch}&name=${this.search_name}&voucher=${this.current_voucher}`);
    this.load_voucher_list();
  }

  keyDownFunction(event) {
    if(event.keyCode == 13) {
      this.filter_people();
    }
  }

  open_new_person_modal() {
    this.modalService.open(ModalType.AddPerson, null);
  }

  open_card_details(card_id) {
    this.cardService.getCardData(card_id).subscribe((result_cardlt_card : Result<Card[]>) => {
      this.modalService.open(ModalType.DetailTask, result_cardlt_card.data[0]);
    });
  }

  load_voucher_list() {
    if(this.person_list_sub) {
      this.person_list_sub.unsubscribe();
    }

    this.person_list_sub = this.personService
    .getInvitedPeopleList(this.current_branch, this.search_name, this.current_voucher)
    .subscribe(
      (result : Result<any[]>) => {
        this.all_people = result.data;

        this.apply_filters();
      }
    );
  }
}
