import { ModalService, ModalType } from 'app/services/modal-service';
import { ParameterService } from 'app/services/parameter-service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DailyMonitorDisplayType } from 'app/services/person-service';

@Component({
  selector: 'organization-card',
  templateUrl: './organization-card.component.html',
  styleUrls: ['./organization-card.scss']
})
export class OrganizationCardComponent implements OnInit {  

  @Input() organization;  
  @Input() compactView = false;
  
  constructor(private parameterService: ParameterService,
              private modalService: ModalService) {
      
  }

  ngOnInit() {    
    
  }

  add_task(organization) {    
    this.modalService.open(ModalType.AddTask, {
      organization
    });
  }

  add_project(organization) {
    this.modalService.open(ModalType.AddProject, {
      organization
    });
  }
}