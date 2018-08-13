
import { zip as observableZip, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit, OnDestroy } from "@angular/core";
import { Result, ErrorCode } from 'app/shared/models/result';
import { Voucher } from 'app/shared/models/voucher-model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './voucher-detail-page.component.html',
  styleUrls: ['../parameters-customizations.scss']
})
export class VoucherDetailPageComponent implements OnInit, OnDestroy {

  private id;
  private sub;


  voucher: Voucher;
  saving = false;
  result_form_text = "";
  branches = [];

  constructor(private parameterService: ParameterService,
    private ngbModalService: NgbModal,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];

      this.load_data();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  entity_compare(optionOne, optionTwo) {
    return optionOne.id == optionTwo.id;
  }

  save() {
    this.saving = true;
    this.parameterService.saveVoucher(this.voucher).subscribe(() => {
      this.result_form_text = "Salvo!";

      setTimeout(() => this.result_form_text = "", 5000);

      this.saving = false;
      this.load_data();
    });
  }

  toggle_receive_voucher(b) {
    this.saving = true;

    b.receive_voucher = !b.receive_voucher;

    (!b.receive_voucher ?
      this.parameterService.remove_voucher_branch(b, this.voucher)
      : this.parameterService.save_voucher_branch(b, this.voucher)
    ).subscribe((result: Result<any>) => {
      this.saving = false;

      if (!result.success && result.error_code != ErrorCode.NothingChanged) {
        b.receive_voucher = !b.receive_voucher;
        this.toastr.error(result.message);
      }
    });
  }

  private load_data(callback = () => { }) {
    observableZip(
      this.parameterService.getVoucher(this.id),
      this.parameterService.getActiveBranches(),
      (result_voucher: Result<Voucher>, result_branches: any[]) => {
        this.voucher = result_voucher.data[0];
        this.branches = result_branches.map(b => {
          b.receive_voucher = this.voucher.branches.find(bv => bv.id == b.id) != null;
          return b;
        });

        if (callback) {
          callback();
        }
      }
    ).subscribe();
  }
}
