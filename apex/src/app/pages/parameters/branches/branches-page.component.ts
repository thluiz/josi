import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ParameterService } from 'app/services/parameter-service';
import { Component, OnInit } from "@angular/core";

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './branches-page.component.html',
  styleUrls: ['../parameters-customizations.scss']  
})
export class BranchesPageComponent implements OnInit {      
  collection: any;
  current_item: any;
  saving = false;

  constructor(private parameterService: ParameterService, 
              private ngbModalService: NgbModal) {      

  }  

  ngOnInit() {
    this.load_data();    
  }

  private load_data() {
    this.parameterService.getBranches().subscribe((data) => {
      this.collection = data;
    });
  }

  save(close_action) {
    this.saving = true;
    this.parameterService.saveBranch(this.current_item).subscribe((data) => {
      if(close_action) {
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
    this.ngbModalService.open(content).result.then((result) => {                                  
        
    }, (reason) => {
        this.current_item = null;
        console.log(reason);
    });
  }
}
