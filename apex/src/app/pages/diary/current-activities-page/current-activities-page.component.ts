import { Component } from '@angular/core';

import { ParameterService } from 'app/services/parameter-service';

import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-full-layout-page',
  templateUrl: './current-activities-page.component.html',
  styleUrls: ['../diary.component.scss']
})
export class CurrentActivitiesPageComponent implements OnInit, OnDestroy {  
  show_change_branch;  
  current_branch = 0;  
  current_branch_name = "Todos os Núcleos";
  branches;  
  current_incident;


  constructor(private parameterService : ParameterService, private modalService: NgbModal) {
    
  }  
 
  ngOnInit() {
    this.parameterService.getActiveBranches().subscribe((data) => {
      this.branches = data;
    });
  }

  ngOnDestroy() {    
           
  }

  branchSelected(id) {        
    this.show_change_branch = false;

    if(this.current_branch == 0) {
      this.current_branch_name = "Todos os Núcleos";
      return;
    }

    const current = this.branches.find((b) => b.id == this.current_branch);
    this.current_branch_name = current.name;    
  }    
  
  open(content, incident) {
    this.current_incident = incident;            
    this.modalService.open(content).result.then((result) => {          
        this.current_incident = null;                              
    }, (reason) => {
        console.log(reason);
    });
  }
}
