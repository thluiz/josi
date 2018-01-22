import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'person-status-line',
  templateUrl: './person-status-line.component.html'
})

export class PersonStatusLineComponent implements OnInit {  

  @Input() person: any;
  @Output() onBeginPersonDataTreatment = new EventEmitter<any>();

  constructor(
    private route: ActivatedRoute,
    private router: Router) {
            
  }

  ngOnInit() {
    
  }

  begin_person_data_treatment() {
    this.onBeginPersonDataTreatment.emit(this.person);
  }
}