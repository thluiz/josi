import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit } from "@angular/core";
import { Observable } from '../../../../../node_modules/rxjs';
import { Result } from 'app/shared/models/result';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './branches-page.component.html',
  styleUrls: ['../parameters-customizations.scss']
})
export class BranchesPageComponent implements OnInit {
  collection: any;
  current_item: any;
  saving = false;
  currencies = [];

  constructor(private parameterService: ParameterService,
    private ngbModalService: NgbModal) {

  }

  ngOnInit() {
    this.load_data();
  }

  private load_data() {
    this.parameterService.getBranches().subscribe((result: Result<any>) => {
      this.collection = result.data;
    });
  }

  save(close_action) {
    this.saving = true;
    this.parameterService.saveBranch(this.current_item).subscribe(() => {
      if (close_action) {
        close_action();
      }
      this.saving = false;
      this.load_data();
    });
  }

  open_new_form_branch(content) {
    this.current_item = {
      id: 0
    };

    this.open_form_modal(content);
  }

  edit(content, item) {
    this.current_item = item;
    this.open_form_modal(content);
  }

  private open_form_modal(content) {
    Observable.zip(
      this.parameterService.getCurrencies(),
      (result_currencies : Result<any[]>) => {
        this.currencies = result_currencies.data;
        this.ngbModalService.open(content).result.then(() => {

        }, (reason) => {
          this.current_item = null;
          console.log(reason);
        });
      }).subscribe();
  }
}
