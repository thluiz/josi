import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from "@angular/core";
import { ParameterService } from "app/services/parameter-service";
import { FinancialService } from 'app/services/financial-service';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './accounts-page.component.html',
  styleUrls: ['../parameters-customizations.scss']  
})
export class AccountsPageComponent implements OnInit {    

  collection: any[];
  branches: any[];
  current_item: any;
  saving = false;

  constructor(private parameterService: ParameterService,
              private finacialService: FinancialService,
              private ngbModalService: NgbModal) {      

  }  

  ngOnInit() {
    this.load_data();    
  }

  private load_data() {
    this.finacialService.getAccounts().subscribe((data: any[]) => {
      this.collection = data;
    });
  }

  save(close_action) {
    this.saving = true;
    this.finacialService.saveAccount(this.current_item).subscribe((data) => {
      if(close_action) {
        close_action();
      }
      this.saving = false;
      this.load_data();
    });
  }

  create(content) {
    const col = this.collection;
    const suggested_order = col.length > 0 ? col[col.length - 1].order + 1 : 0;

    this.current_item = {
      id: 0,
      name: "",
      branch_id: 0,
      order: suggested_order
    }

    this.parameterService.getActiveBranches().subscribe((data) => {
      this.branches = data;
      this.open_modal(content);
    });    
  }

  edit(content, item) {
    this.current_item = item;
    this.open_modal(content);
  }

  private open_modal(content: any) {
    this.ngbModalService.open(content).result.then((result) => {
    }, (reason) => {
      this.current_item = null;
      console.log(reason);
    });
  }
}
