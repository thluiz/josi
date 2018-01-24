
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ModalService, ModalType } from 'app/services/modal-service';

@Component({
  selector: 'person-status-line',
  templateUrl: './person-status-line.component.html'
})

export class PersonStatusLineComponent implements OnInit {  

  @Input() person: any;  

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
    private modalService: ModalService) {
            
  }

  ngOnInit() {
    
  }

  begin_person_data_treatment() {    
    this.modalService.open(ModalType.PersonTreatment, this.person);    
  }
}