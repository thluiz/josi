import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'person-card',
  templateUrl: './person-card.component.html'
})

export class PersonCardComponent implements OnInit {  

  @Input() person: any;

  constructor() {
            
  }

  ngOnInit() {
    
  }
}