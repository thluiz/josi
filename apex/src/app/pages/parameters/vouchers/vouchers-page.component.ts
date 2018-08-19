import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from "@angular/core";
import { ParameterService } from "app/services/parameter-service";
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './vouchers-page.component.html',
  styleUrls: ['../parameters-customizations.scss']
})
export class VouchersPageComponent implements OnInit {
  collection: any[];
  current_item: any;
  saving = false;

  constructor(private parameterService: ParameterService,
              private ngbModalService: NgbModal,
              private router : Router) {

  }

  ngOnInit() {
    this.load_data();
  }

  private load_data() {
    this.parameterService.getVouchers().subscribe((result: Result<any[]>) => {
      this.collection = result.data;
    });
  }

  save(close_action) {
    this.saving = true;
    this.parameterService.saveVoucher(this.current_item).subscribe(() => {
      if(close_action) {
        close_action();
      }
      this.saving = false;
      this.load_data();
    });
  }

  create(content) {
    this.current_item = {
      id: 0
    }

    this.open_modal(content);
  }

  edit(item) {
    this.router.navigateByUrl("/parameters/vouchers/" + item.id);
  }

  private open_modal(content: any) {
    this.saving = false;

    this.ngbModalService.open(content).result.then(() => {
    }, (reason) => {
      this.current_item = null;
      console.log(reason);
    });
  }
}
