
import {zip as observableZip,  Subscription ,  Observable } from 'rxjs';
import { ParameterService } from 'app/services/parameter-service';
import { CardCommentary } from 'app/shared/models/card-commentary.model';
import { DragulaService } from 'ng2-dragula';
import { ModalType } from './../../../services/modal-service';
import { ModalService } from 'app/services/modal-service';
import { Card } from './../../../shared/models/card.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CardService, CARD_CHANGED, CARD_ADDED, CARD_ARCHIVED, CARD_COMMENT_ADDED } from 'app/services/card-service';
import { ActivatedRoute, Router } from '@angular/router';
import { FinancialService } from 'app/services/financial-service';
import { SecurityService } from 'app/services/security-service';

const PROJECT_BAG_NAME = 'childrens';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['../financial-customizations.scss']
})
export class OverviewPageComponent implements OnInit, OnDestroy {
  private sub;
  branch_id: number;
  branches :any[];
  account_data: { data: any, account_status: any, expected_payments: any, missing_payments: any }[] = [];


  constructor(private financialService: FinancialService,
              private securityService: SecurityService,
              private modalService: ModalService,
              private parameterService: ParameterService,
              private route: ActivatedRoute,
              private router: Router) {

  }

  ngOnInit() {
    observableZip(
      this.parameterService.getActiveBranches(),
      this.securityService.getCurrentUserData(),
      this.route.params,
      (branches, user, params) => {
        this.branches = branches;
        this.branch_id = user.default_branch_id || +params['branch_id'];
        this.load_data();
      }
    ).subscribe();
  }

  ngOnDestroy() {
    if(this.sub) {
      this.sub.unsubscribe();
    }
  }

  public change_branch() {
    this.router.navigateByUrl(`financial/${this.branch_id}`);
    this.account_data = null;
    this.account_data = [];
    this.load_data();
  }

  private load_data() {
    this.financialService.getBranchAccounts(this.branch_id).subscribe((data : any[]) => {
      data.forEach((account : any) => {
        var account_id = account.id;

        let account_data = {data: account, account_status: null, expected_payments: null, missing_payments: null };

        this.financialService.getAccountStatus(account_id).subscribe((data : any[]) => {
          account_data.account_status = data;
        });

        this.financialService.getExpectedPayments(account_id).subscribe((data : any[]) => {
          account_data.expected_payments = data;
        });

        this.financialService.getMissingPayments(account_id).subscribe((data : any[]) => {
          account_data.missing_payments = data;
        });

        this.account_data[this.account_data.length] = account_data;
      })
    });
  }

}
