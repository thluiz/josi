import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from "@angular/core";
import { ParameterService } from "app/services/parameter-service";

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
              private ngbModalService: NgbModal) {      

  }  

  ngOnInit() {
    this.load_data();    
  }

  private load_data() {
    this.parameterService.getVouchers().subscribe((data: any[]) => {
      this.collection = data;
    });
  }

  save(close_action) {
    this.saving = true;
    this.parameterService.saveVoucher(this.current_item).subscribe((data) => {
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
